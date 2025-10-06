import type { XpRulesService } from "./xp-rules.service";
import type { CreateXpRuleDto } from "./dto/create-xp-rule.dto";
import type { UpdateXpRuleDto } from "./dto/update-xp-rule.dto";
import type { SimulateImpactDto } from "./dto/simulate-impact.dto";
import type { ApplyRulesDto } from "./dto/apply-rules.dto";
export declare class XpRulesController {
    private readonly xpRulesService;
    constructor(xpRulesService: XpRulesService);
    createRule(dto: CreateXpRuleDto): Promise<import("./entities/xp-rule.entity").XpRule>;
    updateRule(ruleId: string, dto: UpdateXpRuleDto): Promise<import("./entities/xp-rule.entity").XpRule>;
    getActiveRules(scope?: string): Promise<import("./entities/xp-rule.entity").XpRule[]>;
    applyGlobalRules(userId: string, ruleType: string, baseXp: number): Promise<number>;
    simulateImpact(dto: SimulateImpactDto): Promise<import("./entities/xp-simulation.entity").XpSimulation>;
    applySimulation(dto: ApplyRulesDto): Promise<{
        applied: number;
        notified: number;
    }>;
    getRuleVersions(ruleId: string): Promise<import("./entities/xp-rule-version.entity").XpRuleVersion[]>;
    getSimulations(limit?: number): Promise<import("./entities/xp-simulation.entity").XpSimulation[]>;
    getUserNotifications(userId: string, unreadOnly?: boolean): Promise<import("./entities/xp-change-notification.entity").XpChangeNotification[]>;
    markNotificationRead(notificationId: string): Promise<void>;
}
