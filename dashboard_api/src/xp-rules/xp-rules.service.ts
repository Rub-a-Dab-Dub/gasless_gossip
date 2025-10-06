import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import { XpRule } from "./entities/xp-rule.entity"
import { XpRuleVersion } from "./entities/xp-rule-version.entity"
import { XpSimulation } from "./entities/xp-simulation.entity"
import { XpChangeNotification } from "./entities/xp-change-notification.entity"
import type { CreateXpRuleDto } from "./dto/create-xp-rule.dto"
import type { UpdateXpRuleDto } from "./dto/update-xp-rule.dto"
import type { SimulateImpactDto } from "./dto/simulate-impact.dto"
import type { ApplyRulesDto } from "./dto/apply-rules.dto"

@Injectable()
export class XpRulesService {
  private xpRuleRepo: Repository<XpRule>
  private versionRepo: Repository<XpRuleVersion>
  private simulationRepo: Repository<XpSimulation>
  private notificationRepo: Repository<XpChangeNotification>
  private configCache: Map<string, XpRule[]> = new Map()

  constructor(repoFactory: any) {
    this.xpRuleRepo = repoFactory.getRepository(XpRule)
    this.versionRepo = repoFactory.getRepository(XpRuleVersion)
    this.simulationRepo = repoFactory.getRepository(XpSimulation)
    this.notificationRepo = repoFactory.getRepository(XpChangeNotification)

    // Initialize cache
    this.loadRulesIntoCache()
  }

  async createRule(dto: CreateXpRuleDto): Promise<XpRule> {
    const rule = this.xpRuleRepo.create({
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    })

    const saved = await this.xpRuleRepo.save(rule)

    // Create initial version
    await this.createVersion(saved.id, saved, "Initial creation", dto.createdBy)

    // Reload cache
    await this.loadRulesIntoCache()

    return saved
  }

  async updateRule(ruleId: string, dto: UpdateXpRuleDto): Promise<XpRule> {
    const rule = await this.xpRuleRepo.findOne({ where: { id: ruleId } })
    if (!rule) throw new Error("Rule not found")

    // Store old values for version history
    const oldRule = { ...rule }

    // Update rule
    Object.assign(rule, dto)
    const updated = await this.xpRuleRepo.save(rule)

    // Create version
    await this.createVersion(ruleId, updated, dto.changeDescription || "Rule updated", dto.updatedBy)

    // Reload cache (hot reload)
    await this.loadRulesIntoCache()

    // Notify about changes
    await this.notifyRuleChange(updated, oldRule)

    return updated
  }

  async getActiveRules(scope = "global"): Promise<XpRule[]> {
    // Check cache first
    const cacheKey = `active_${scope}`
    if (this.configCache.has(cacheKey)) {
      return this.configCache.get(cacheKey)!
    }

    const rules = await this.xpRuleRepo.find({
      where: { isActive: true, scope },
      order: { priority: "DESC" },
    })

    this.configCache.set(cacheKey, rules)
    return rules
  }

  async applyGlobalRules(userId: string, ruleType: string, baseXp: number): Promise<number> {
    const rules = await this.getActiveRules("global")
    const applicableRules = rules.filter((r) => r.ruleType === ruleType && this.checkConditions(r, userId))

    let finalXp = baseXp

    for (const rule of applicableRules) {
      finalXp = (finalXp + rule.baseAmount) * rule.multiplier
    }

    return Math.round(finalXp)
  }

  async simulateImpact(dto: SimulateImpactDto): Promise<XpSimulation> {
    const { simulationName, ruleChanges, createdBy } = dto

    // Get current rules
    const ruleIds = ruleChanges.map((rc) => rc.ruleId)
    const currentRules = await this.xpRuleRepo.findByIds(ruleIds)

    // Calculate impact
    const impactAnalysis = await this.calculateImpact(currentRules, ruleChanges)

    // Create simulation record
    const simulation = this.simulationRepo.create({
      simulationId: `sim_${Date.now()}`,
      simulationName,
      ruleChanges: ruleChanges.map((rc) => {
        const currentRule = currentRules.find((r) => r.id === rc.ruleId)
        return {
          ruleId: rc.ruleId,
          ruleName: currentRule?.ruleName || "Unknown",
          oldMultiplier: currentRule?.multiplier || 1,
          newMultiplier: rc.newMultiplier || currentRule?.multiplier || 1,
          oldBaseAmount: currentRule?.baseAmount || 0,
          newBaseAmount: rc.newBaseAmount || currentRule?.baseAmount || 0,
        }
      }),
      impactAnalysis,
      status: "completed",
      createdBy,
    })

    return this.simulationRepo.save(simulation)
  }

  async applySimulation(dto: ApplyRulesDto): Promise<{ applied: number; notified: number }> {
    const { simulationId, notifyUsers = true, appliedBy } = dto

    const simulation = await this.simulationRepo.findOne({ where: { simulationId } })
    if (!simulation) throw new Error("Simulation not found")

    let appliedCount = 0

    // Apply each rule change
    for (const change of simulation.ruleChanges) {
      await this.updateRule(change.ruleId, {
        multiplier: change.newMultiplier,
        baseAmount: change.newBaseAmount,
        updatedBy: appliedBy,
        changeDescription: `Applied from simulation: ${simulation.simulationName}`,
      })
      appliedCount++
    }

    // Update simulation status
    simulation.status = "applied"
    simulation.appliedAt = new Date()
    await this.simulationRepo.save(simulation)

    // Notify users if requested
    let notifiedCount = 0
    if (notifyUsers) {
      notifiedCount = await this.notifyGlobalChange(simulation)
    }

    return { applied: appliedCount, notified: notifiedCount }
  }

  async getRuleVersions(ruleId: string): Promise<XpRuleVersion[]> {
    return this.versionRepo.find({
      where: { ruleId },
      order: { version: "DESC" },
    })
  }

  async getSimulations(limit = 50): Promise<XpSimulation[]> {
    return this.simulationRepo.find({
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async getUserNotifications(userId: string, unreadOnly = false): Promise<XpChangeNotification[]> {
    const where: any = { userId }
    if (unreadOnly) where.isRead = false

    return this.notificationRepo.find({
      where,
      order: { createdAt: "DESC" },
      take: 50,
    })
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await this.notificationRepo.update({ id: notificationId }, { isRead: true, readAt: new Date() })
  }

  private async loadRulesIntoCache(): Promise<void> {
    const allRules = await this.xpRuleRepo.find({ where: { isActive: true } })

    // Group by scope
    const byScope = allRules.reduce(
      (acc, rule) => {
        if (!acc[rule.scope]) acc[rule.scope] = []
        acc[rule.scope].push(rule)
        return acc
      },
      {} as Record<string, XpRule[]>,
    )

    // Update cache
    this.configCache.clear()
    for (const [scope, rules] of Object.entries(byScope)) {
      this.configCache.set(`active_${scope}`, rules)
    }
  }

  private async createVersion(
    ruleId: string,
    rule: XpRule,
    changeDescription: string,
    changedBy?: string,
  ): Promise<XpRuleVersion> {
    const versions = await this.versionRepo.find({ where: { ruleId } })
    const nextVersion = versions.length + 1

    const version = this.versionRepo.create({
      ruleId,
      version: nextVersion,
      ruleData: {
        ruleName: rule.ruleName,
        ruleType: rule.ruleType,
        multiplier: rule.multiplier,
        baseAmount: rule.baseAmount,
        conditions: rule.conditions,
        isActive: rule.isActive,
        priority: rule.priority,
        scope: rule.scope,
      },
      changeDescription,
      changedBy,
    })

    return this.versionRepo.save(version)
  }

  private checkConditions(rule: XpRule, userId: string): boolean {
    // Implement condition checking logic
    // This would check user level, segment, time windows, etc.
    return true
  }

  private async calculateImpact(
    currentRules: XpRule[],
    changes: Array<{ ruleId: string; newMultiplier?: number; newBaseAmount?: number }>,
  ): Promise<any> {
    // Simplified impact calculation
    // In production, this would query user data and calculate actual impact
    const totalMultiplierChange = changes.reduce((sum, change) => {
      const current = currentRules.find((r) => r.id === change.ruleId)
      const oldMult = current?.multiplier || 1
      const newMult = change.newMultiplier || oldMult
      return sum + (newMult - oldMult)
    }, 0)

    return {
      affectedUsers: 1000, // Mock data
      avgXpChange: totalMultiplierChange * 100,
      minXpChange: totalMultiplierChange * 50,
      maxXpChange: totalMultiplierChange * 200,
      totalXpImpact: totalMultiplierChange * 100000,
      levelDistributionChange: {
        "1-10": 50,
        "11-20": 100,
        "21-30": 150,
      },
    }
  }

  private async notifyRuleChange(newRule: XpRule, oldRule: XpRule): Promise<void> {
    const notification = this.notificationRepo.create({
      userId: null, // Global notification
      notificationType: "rule_change",
      title: `XP Rule Updated: ${newRule.ruleName}`,
      message: `The ${newRule.ruleName} rule has been updated. Multiplier changed from ${oldRule.multiplier}x to ${newRule.multiplier}x.`,
      changes: {
        ruleId: newRule.id,
        ruleName: newRule.ruleName,
        oldValue: oldRule.multiplier,
        newValue: newRule.multiplier,
        impact: "Your XP earnings may be affected",
      },
    })

    await this.notificationRepo.save(notification)
  }

  private async notifyGlobalChange(simulation: XpSimulation): Promise<number> {
    const notification = this.notificationRepo.create({
      userId: null,
      notificationType: "multiplier_update",
      title: "XP System Updated",
      message: `Multiple XP rules have been updated as part of: ${simulation.simulationName}`,
      changes: {
        impact: `Estimated impact: ${simulation.impactAnalysis.avgXpChange} XP change on average`,
      },
    })

    await this.notificationRepo.save(notification)
    return 1 // In production, would notify all affected users
  }
}
