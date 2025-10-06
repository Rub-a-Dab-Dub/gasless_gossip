import { XpRule } from "./entities/xp-rule.entity";
import { XpRuleVersion } from "./entities/xp-rule-version.entity";
import { XpSimulation } from "./entities/xp-simulation.entity";
import { XpChangeNotification } from "./entities/xp-change-notification.entity";
import type { CreateXpRuleDto } from "./dto/create-xp-rule.dto";
import type { UpdateXpRuleDto } from "./dto/update-xp-rule.dto";
import type { SimulateImpactDto } from "./dto/simulate-impact.dto";
import type { ApplyRulesDto } from "./dto/apply-rules.dto";
export declare class XpRulesService {
    private xpRuleRepo;
    private versionRepo;
    private simulationRepo;
    private notificationRepo;
    private configCache;
    constructor(repoFactory: any);
    createRule(dto: CreateXpRuleDto): Promise<XpRule>;
    updateRule(ruleId: string, dto: UpdateXpRuleDto): Promise<XpRule>;
    getActiveRules(scope?: string): Promise<XpRule[]>;
    applyGlobalRules(userId: string, ruleType: string, baseXp: number): Promise<number>;
    simulateImpact(dto: SimulateImpactDto): Promise<XpSimulation>;
    applySimulation(dto: ApplyRulesDto): Promise<{
        applied: number;
        notified: number;
    }>;
    getRuleVersions(ruleId: string): Promise<XpRuleVersion[]>;
    getSimulations(limit?: number): Promise<XpSimulation[]>;
    getUserNotifications(userId: string, unreadOnly?: boolean): Promise<XpChangeNotification[]>;
    markNotificationRead(notificationId: string): Promise<void>;
    private loadRulesIntoCache;
    private createVersion;
    private checkConditions;
    private calculateImpact;
    private notifyRuleChange;
    private notifyGlobalChange;
}
