import type { QuestAuditService } from "./quest-audit.service";
import type { CreateQuestCompletionDto } from "./dto/create-quest-completion.dto";
import type { ReverseCompletionDto } from "./dto/reverse-completion.dto";
import type { QueryAuditDto } from "./dto/query-audit.dto";
import type { BulkAuditDto } from "./dto/bulk-audit.dto";
export declare class QuestAuditController {
    private readonly questAuditService;
    constructor(questAuditService: QuestAuditService);
    logCompletion(dto: CreateQuestCompletionDto): Promise<import("./entities/quest-completion.entity").QuestCompletion>;
    detectDuplicates(userId: string, questId: string): Promise<import("./entities/quest-completion.entity").QuestCompletion[]>;
    reverseCompletion(dto: ReverseCompletionDto): Promise<import("./entities/quest-completion.entity").QuestCompletion>;
    getUserHistory(userId: string, limit?: number): Promise<import("./entities/quest-completion.entity").QuestCompletion[]>;
    getAlerts(query: QueryAuditDto): Promise<import("./entities/audit-alert.entity").AuditAlert[]>;
    bulkAudit(dto: BulkAuditDto): Promise<{
        affected: number;
    }>;
    getExploitPatterns(): Promise<import("./entities/exploit-pattern.entity").ExploitPattern[]>;
    getPatternDashboard(): Promise<any>;
}
