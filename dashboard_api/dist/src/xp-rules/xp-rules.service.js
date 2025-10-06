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
exports.XpRulesService = void 0;
const common_1 = require("@nestjs/common");
const xp_rule_entity_1 = require("./entities/xp-rule.entity");
const xp_rule_version_entity_1 = require("./entities/xp-rule-version.entity");
const xp_simulation_entity_1 = require("./entities/xp-simulation.entity");
const xp_change_notification_entity_1 = require("./entities/xp-change-notification.entity");
let XpRulesService = class XpRulesService {
    xpRuleRepo;
    versionRepo;
    simulationRepo;
    notificationRepo;
    configCache = new Map();
    constructor(repoFactory) {
        this.xpRuleRepo = repoFactory.getRepository(xp_rule_entity_1.XpRule);
        this.versionRepo = repoFactory.getRepository(xp_rule_version_entity_1.XpRuleVersion);
        this.simulationRepo = repoFactory.getRepository(xp_simulation_entity_1.XpSimulation);
        this.notificationRepo = repoFactory.getRepository(xp_change_notification_entity_1.XpChangeNotification);
        this.loadRulesIntoCache();
    }
    async createRule(dto) {
        const rule = this.xpRuleRepo.create({
            ...dto,
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        });
        const saved = await this.xpRuleRepo.save(rule);
        await this.createVersion(saved.id, saved, "Initial creation", dto.createdBy);
        await this.loadRulesIntoCache();
        return saved;
    }
    async updateRule(ruleId, dto) {
        const rule = await this.xpRuleRepo.findOne({ where: { id: ruleId } });
        if (!rule)
            throw new Error("Rule not found");
        const oldRule = { ...rule };
        Object.assign(rule, dto);
        const updated = await this.xpRuleRepo.save(rule);
        await this.createVersion(ruleId, updated, dto.changeDescription || "Rule updated", dto.updatedBy);
        await this.loadRulesIntoCache();
        await this.notifyRuleChange(updated, oldRule);
        return updated;
    }
    async getActiveRules(scope = "global") {
        const cacheKey = `active_${scope}`;
        if (this.configCache.has(cacheKey)) {
            return this.configCache.get(cacheKey);
        }
        const rules = await this.xpRuleRepo.find({
            where: { isActive: true, scope },
            order: { priority: "DESC" },
        });
        this.configCache.set(cacheKey, rules);
        return rules;
    }
    async applyGlobalRules(userId, ruleType, baseXp) {
        const rules = await this.getActiveRules("global");
        const applicableRules = rules.filter((r) => r.ruleType === ruleType && this.checkConditions(r, userId));
        let finalXp = baseXp;
        for (const rule of applicableRules) {
            finalXp = (finalXp + rule.baseAmount) * rule.multiplier;
        }
        return Math.round(finalXp);
    }
    async simulateImpact(dto) {
        const { simulationName, ruleChanges, createdBy } = dto;
        const ruleIds = ruleChanges.map((rc) => rc.ruleId);
        const currentRules = await this.xpRuleRepo.findByIds(ruleIds);
        const impactAnalysis = await this.calculateImpact(currentRules, ruleChanges);
        const simulation = this.simulationRepo.create({
            simulationId: `sim_${Date.now()}`,
            simulationName,
            ruleChanges: ruleChanges.map((rc) => {
                const currentRule = currentRules.find((r) => r.id === rc.ruleId);
                return {
                    ruleId: rc.ruleId,
                    ruleName: currentRule?.ruleName || "Unknown",
                    oldMultiplier: currentRule?.multiplier || 1,
                    newMultiplier: rc.newMultiplier || currentRule?.multiplier || 1,
                    oldBaseAmount: currentRule?.baseAmount || 0,
                    newBaseAmount: rc.newBaseAmount || currentRule?.baseAmount || 0,
                };
            }),
            impactAnalysis,
            status: "completed",
            createdBy,
        });
        return this.simulationRepo.save(simulation);
    }
    async applySimulation(dto) {
        const { simulationId, notifyUsers = true, appliedBy } = dto;
        const simulation = await this.simulationRepo.findOne({ where: { simulationId } });
        if (!simulation)
            throw new Error("Simulation not found");
        let appliedCount = 0;
        for (const change of simulation.ruleChanges) {
            await this.updateRule(change.ruleId, {
                multiplier: change.newMultiplier,
                baseAmount: change.newBaseAmount,
                updatedBy: appliedBy,
                changeDescription: `Applied from simulation: ${simulation.simulationName}`,
            });
            appliedCount++;
        }
        simulation.status = "applied";
        simulation.appliedAt = new Date();
        await this.simulationRepo.save(simulation);
        let notifiedCount = 0;
        if (notifyUsers) {
            notifiedCount = await this.notifyGlobalChange(simulation);
        }
        return { applied: appliedCount, notified: notifiedCount };
    }
    async getRuleVersions(ruleId) {
        return this.versionRepo.find({
            where: { ruleId },
            order: { version: "DESC" },
        });
    }
    async getSimulations(limit = 50) {
        return this.simulationRepo.find({
            order: { createdAt: "DESC" },
            take: limit,
        });
    }
    async getUserNotifications(userId, unreadOnly = false) {
        const where = { userId };
        if (unreadOnly)
            where.isRead = false;
        return this.notificationRepo.find({
            where,
            order: { createdAt: "DESC" },
            take: 50,
        });
    }
    async markNotificationRead(notificationId) {
        await this.notificationRepo.update({ id: notificationId }, { isRead: true, readAt: new Date() });
    }
    async loadRulesIntoCache() {
        const allRules = await this.xpRuleRepo.find({ where: { isActive: true } });
        const byScope = allRules.reduce((acc, rule) => {
            if (!acc[rule.scope])
                acc[rule.scope] = [];
            acc[rule.scope].push(rule);
            return acc;
        }, {});
        this.configCache.clear();
        for (const [scope, rules] of Object.entries(byScope)) {
            this.configCache.set(`active_${scope}`, rules);
        }
    }
    async createVersion(ruleId, rule, changeDescription, changedBy) {
        const versions = await this.versionRepo.find({ where: { ruleId } });
        const nextVersion = versions.length + 1;
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
        });
        return this.versionRepo.save(version);
    }
    checkConditions(rule, userId) {
        return true;
    }
    async calculateImpact(currentRules, changes) {
        const totalMultiplierChange = changes.reduce((sum, change) => {
            const current = currentRules.find((r) => r.id === change.ruleId);
            const oldMult = current?.multiplier || 1;
            const newMult = change.newMultiplier || oldMult;
            return sum + (newMult - oldMult);
        }, 0);
        return {
            affectedUsers: 1000,
            avgXpChange: totalMultiplierChange * 100,
            minXpChange: totalMultiplierChange * 50,
            maxXpChange: totalMultiplierChange * 200,
            totalXpImpact: totalMultiplierChange * 100000,
            levelDistributionChange: {
                "1-10": 50,
                "11-20": 100,
                "21-30": 150,
            },
        };
    }
    async notifyRuleChange(newRule, oldRule) {
        const notification = this.notificationRepo.create({
            userId: null,
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
        });
        await this.notificationRepo.save(notification);
    }
    async notifyGlobalChange(simulation) {
        const notification = this.notificationRepo.create({
            userId: null,
            notificationType: "multiplier_update",
            title: "XP System Updated",
            message: `Multiple XP rules have been updated as part of: ${simulation.simulationName}`,
            changes: {
                impact: `Estimated impact: ${simulation.impactAnalysis.avgXpChange} XP change on average`,
            },
        });
        await this.notificationRepo.save(notification);
        return 1;
    }
};
exports.XpRulesService = XpRulesService;
exports.XpRulesService = XpRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], XpRulesService);
//# sourceMappingURL=xp-rules.service.js.map