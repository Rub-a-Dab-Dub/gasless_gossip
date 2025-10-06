import { Injectable } from "@nestjs/common"
import { type Repository, Between, In } from "typeorm"
import { QuestCompletion } from "./entities/quest-completion.entity"
import { ExploitPattern } from "./entities/exploit-pattern.entity"
import { AuditAlert } from "./entities/audit-alert.entity"
import type { CreateQuestCompletionDto } from "./dto/create-quest-completion.dto"
import type { ReverseCompletionDto } from "./dto/reverse-completion.dto"
import type { QueryAuditDto } from "./dto/query-audit.dto"
import type { BulkAuditDto } from "./dto/bulk-audit.dto"

@Injectable()
export class QuestAuditService {
  private questCompletionRepo: Repository<QuestCompletion>
  private exploitPatternRepo: Repository<ExploitPattern>
  private auditAlertRepo: Repository<AuditAlert>

  constructor(repoFactory: any) {
    this.questCompletionRepo = repoFactory.getRepository(QuestCompletion)
    this.exploitPatternRepo = repoFactory.getRepository(ExploitPattern)
    this.auditAlertRepo = repoFactory.getRepository(AuditAlert)
  }

  async logCompletion(dto: CreateQuestCompletionDto): Promise<QuestCompletion> {
    const completion = this.questCompletionRepo.create(dto)
    const saved = await this.questCompletionRepo.save(completion)

    // Run exploit detection
    await this.detectExploits(saved)

    return saved
  }

  async detectDuplicates(userId: string, questId: string): Promise<QuestCompletion[]> {
    const completions = await this.questCompletionRepo.find({
      where: { userId, questId, isReversed: false },
      order: { completedAt: "DESC" },
    })

    if (completions.length > 1) {
      // Flag duplicates
      const duplicateIds = completions.slice(1).map((c) => c.id)
      await this.questCompletionRepo.update({ id: In(duplicateIds) }, { isFlagged: true })

      // Create alert
      await this.createAlert({
        userId,
        questId,
        alertType: "duplicate",
        severity: "high",
        description: `User completed quest ${questId} ${completions.length} times`,
        evidence: {
          completionIds: completions.map((c) => c.id),
        },
      })
    }

    return completions
  }

  async reverseCompletion(dto: ReverseCompletionDto): Promise<QuestCompletion> {
    const completion = await this.questCompletionRepo.findOne({
      where: { id: dto.completionId },
    })

    if (!completion) {
      throw new Error("Completion not found")
    }

    completion.isReversed = true
    completion.reverseReason = dto.reason
    completion.reversedBy = dto.reversedBy
    completion.reversedAt = new Date()

    return this.questCompletionRepo.save(completion)
  }

  async getUserHistory(userId: string, limit = 100): Promise<QuestCompletion[]> {
    return this.questCompletionRepo.find({
      where: { userId },
      order: { completedAt: "DESC" },
      take: limit,
    })
  }

  async getAlerts(query: QueryAuditDto): Promise<AuditAlert[]> {
    const where: any = {}

    if (query.userId) where.userId = query.userId
    if (query.alertStatus) where.status = query.alertStatus
    if (query.severity) where.severity = query.severity

    if (query.startDate && query.endDate) {
      where.createdAt = Between(new Date(query.startDate), new Date(query.endDate))
    }

    return this.auditAlertRepo.find({
      where,
      order: { createdAt: "DESC" },
      take: 100,
    })
  }

  async bulkAudit(dto: BulkAuditDto): Promise<{ affected: number }> {
    const { completionIds, action, reason, performedBy } = dto

    if (action === "flag") {
      const result = await this.questCompletionRepo.update({ id: In(completionIds) }, { isFlagged: true })
      return { affected: result.affected || 0 }
    }

    if (action === "reverse") {
      const result = await this.questCompletionRepo.update(
        { id: In(completionIds) },
        {
          isReversed: true,
          reverseReason: reason,
          reversedBy: performedBy,
          reversedAt: new Date(),
        },
      )
      return { affected: result.affected || 0 }
    }

    if (action === "clear") {
      const result = await this.questCompletionRepo.update({ id: In(completionIds) }, { isFlagged: false })
      return { affected: result.affected || 0 }
    }

    return { affected: 0 }
  }

  async getExploitPatterns(): Promise<ExploitPattern[]> {
    return this.exploitPatternRepo.find({
      where: { isActive: true },
      order: { severity: "DESC" },
    })
  }

  async getPatternDashboard(): Promise<any> {
    const patterns = await this.exploitPatternRepo.find()
    const recentAlerts = await this.auditAlertRepo.find({
      where: { status: "pending" },
      order: { createdAt: "DESC" },
      take: 50,
    })

    const alertsBySeverity = recentAlerts.reduce(
      (acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      patterns: patterns.map((p) => ({
        id: p.id,
        name: p.patternName,
        severity: p.severity,
        detectionCount: p.detectionCount,
        lastDetected: p.lastDetectedAt,
        isActive: p.isActive,
      })),
      alerts: {
        total: recentAlerts.length,
        bySeverity: alertsBySeverity,
        recent: recentAlerts.slice(0, 10),
      },
    }
  }

  private async detectExploits(completion: QuestCompletion): Promise<void> {
    const patterns = await this.getExploitPatterns()

    for (const pattern of patterns) {
      const rules = pattern.detectionRules

      // Check rapid completions
      if (rules.timeWindow && rules.maxCompletions) {
        const since = new Date(Date.now() - rules.timeWindow * 1000)
        const recentCompletions = await this.questCompletionRepo.count({
          where: {
            userId: completion.userId,
            questId: completion.questId,
            completedAt: Between(since, new Date()),
          },
        })

        if (recentCompletions > rules.maxCompletions) {
          await this.createAlert({
            userId: completion.userId,
            questId: completion.questId,
            alertType: "rapid_completion",
            severity: pattern.severity,
            description: `${recentCompletions} completions in ${rules.timeWindow}s`,
            evidence: { timeWindow: rules.timeWindow, completionIds: [completion.id] },
          })
        }
      }

      // Check IP duplication
      if (rules.ipDuplication && completion.ipAddress) {
        const ipCompletions = await this.questCompletionRepo.count({
          where: {
            ipAddress: completion.ipAddress,
            questId: completion.questId,
          },
        })

        if (ipCompletions > 5) {
          await this.createAlert({
            userId: completion.userId,
            questId: completion.questId,
            alertType: "ip_abuse",
            severity: pattern.severity,
            description: `IP ${completion.ipAddress} used ${ipCompletions} times`,
            evidence: { ipAddresses: [completion.ipAddress] },
          })
        }
      }
    }
  }

  private async createAlert(data: Partial<AuditAlert>): Promise<AuditAlert> {
    const alert = this.auditAlertRepo.create(data)
    return this.auditAlertRepo.save(alert)
  }
}
