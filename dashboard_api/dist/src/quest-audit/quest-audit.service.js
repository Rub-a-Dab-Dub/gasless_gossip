"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestAuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const quest_completion_entity_1 = require("./entities/quest-completion.entity");
const exploit_pattern_entity_1 = require("./entities/exploit-pattern.entity");
const audit_alert_entity_1 = require("./entities/audit-alert.entity");
let QuestAuditService = class QuestAuditService {
    questCompletionRepo;
    exploitPatternRepo;
    auditAlertRepo;
    constructor(repoFactory) {
        this.questCompletionRepo = repoFactory.getRepository(quest_completion_entity_1.QuestCompletion);
        this.exploitPatternRepo = repoFactory.getRepository(exploit_pattern_entity_1.ExploitPattern);
        this.auditAlertRepo = repoFactory.getRepository(audit_alert_entity_1.AuditAlert);
    }
    async logCompletion(dto) {
        const completion = this.questCompletionRepo.create(dto);
        const saved = await this.questCompletionRepo.save(completion);
        await this.detectExploits(saved);
        return saved;
    }
    async detectDuplicates(userId, questId) {
        const completions = await this.questCompletionRepo.find({
            where: { userId, questId, isReversed: false },
            order: { completedAt: "DESC" },
        });
        if (completions.length > 1) {
            const duplicateIds = completions.slice(1).map((c) => c.id);
            await this.questCompletionRepo.update({ id: (0, typeorm_1.In)(duplicateIds) }, { isFlagged: true });
            await this.createAlert({
                userId,
                questId,
                alertType: "duplicate",
                severity: "high",
                description: `User completed quest ${questId} ${completions.length} times`,
                evidence: {
                    completionIds: completions.map((c) => c.id),
                },
            });
        }
        return completions;
    }
    async reverseCompletion(dto) {
        const completion = await this.questCompletionRepo.findOne({
            where: { id: dto.completionId },
        });
        if (!completion) {
            throw new Error("Completion not found");
        }
        completion.isReversed = true;
        completion.reverseReason = dto.reason;
        completion.reversedBy = dto.reversedBy;
        completion.reversedAt = new Date();
        return this.questCompletionRepo.save(completion);
    }
    async getUserHistory(userId, limit = 100) {
        return this.questCompletionRepo.find({
            where: { userId },
            order: { completedAt: "DESC" },
            take: limit,
        });
    }
    async getAlerts(query) {
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.alertStatus)
            where.status = query.alertStatus;
        if (query.severity)
            where.severity = query.severity;
        if (query.startDate && query.endDate) {
            where.createdAt = (0, typeorm_1.Between)(new Date(query.startDate), new Date(query.endDate));
        }
        return this.auditAlertRepo.find({
            where,
            order: { createdAt: "DESC" },
            take: 100,
        });
    }
    async bulkAudit(dto) {
        const { completionIds, action, reason, performedBy } = dto;
        if (action === "flag") {
            const result = await this.questCompletionRepo.update({ id: (0, typeorm_1.In)(completionIds) }, { isFlagged: true });
            return { affected: result.affected || 0 };
        }
        if (action === "reverse") {
            const result = await this.questCompletionRepo.update({ id: (0, typeorm_1.In)(completionIds) }, {
                isReversed: true,
                reverseReason: reason,
                reversedBy: performedBy,
                reversedAt: new Date(),
            });
            return { affected: result.affected || 0 };
        }
        if (action === "clear") {
            const result = await this.questCompletionRepo.update({ id: (0, typeorm_1.In)(completionIds) }, { isFlagged: false });
            return { affected: result.affected || 0 };
        }
        return { affected: 0 };
    }
    async getExploitPatterns() {
        return this.exploitPatternRepo.find({
            where: { isActive: true },
            order: { severity: "DESC" },
        });
    }
    async getPatternDashboard() {
        const patterns = await this.exploitPatternRepo.find();
        const recentAlerts = await this.auditAlertRepo.find({
            where: { status: "pending" },
            order: { createdAt: "DESC" },
            take: 50,
        });
        const alertsBySeverity = recentAlerts.reduce((acc, alert) => {
            acc[alert.severity] = (acc[alert.severity] || 0) + 1;
            return acc;
        }, {});
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
        };
    }
    async detectExploits(completion) {
        const patterns = await this.getExploitPatterns();
        for (const pattern of patterns) {
            const rules = pattern.detectionRules;
            if (rules.timeWindow && rules.maxCompletions) {
                const since = new Date(Date.now() - rules.timeWindow * 1000);
                const recentCompletions = await this.questCompletionRepo.count({
                    where: {
                        userId: completion.userId,
                        questId: completion.questId,
                        completedAt: (0, typeorm_1.Between)(since, new Date()),
                    },
                });
                if (recentCompletions > rules.maxCompletions) {
                    await this.createAlert({
                        userId: completion.userId,
                        questId: completion.questId,
                        alertType: "rapid_completion",
                        severity: pattern.severity,
                        description: `${recentCompletions} completions in ${rules.timeWindow}s`,
                        evidence: { timeWindow: rules.timeWindow, completionIds: [completion.id] },
                    });
                }
            }
            if (rules.ipDuplication && completion.ipAddress) {
                const ipCompletions = await this.questCompletionRepo.count({
                    where: {
                        ipAddress: completion.ipAddress,
                        questId: completion.questId,
                    },
                });
                if (ipCompletions > 5) {
                    await this.createAlert({
                        userId: completion.userId,
                        questId: completion.questId,
                        alertType: "ip_abuse",
                        severity: pattern.severity,
                        description: `IP ${completion.ipAddress} used ${ipCompletions} times`,
                        evidence: { ipAddresses: [completion.ipAddress] },
                    });
                }
            }
        }
    }
    async createAlert(data) {
        const alert = this.auditAlertRepo.create(data);
        return this.auditAlertRepo.save(alert);
    }
};
exports.QuestAuditService = QuestAuditService;
exports.QuestAuditService = QuestAuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], QuestAuditService);
//# sourceMappingURL=quest-audit.service.js.map