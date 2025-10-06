import { QuestCompletion } from "./entities/quest-completion.entity";
import { ExploitPattern } from "./entities/exploit-pattern.entity";
import { AuditAlert } from "./entities/audit-alert.entity";
import type { CreateQuestCompletionDto } from "./dto/create-quest-completion.dto";
import type { ReverseCompletionDto } from "./dto/reverse-completion.dto";
import type { QueryAuditDto } from "./dto/query-audit.dto";
import type { BulkAuditDto } from "./dto/bulk-audit.dto";
export declare class QuestAuditService {
    private questCompletionRepo;
    private exploitPatternRepo;
    private auditAlertRepo;
    constructor(repoFactory: any);
    logCompletion(dto: CreateQuestCompletionDto): Promise<QuestCompletion>;
    detectDuplicates(userId: string, questId: string): Promise<QuestCompletion[]>;
    reverseCompletion(dto: ReverseCompletionDto): Promise<QuestCompletion>;
    getUserHistory(userId: string, limit?: number): Promise<QuestCompletion[]>;
    getAlerts(query: QueryAuditDto): Promise<AuditAlert[]>;
    bulkAudit(dto: BulkAuditDto): Promise<{
        affected: number;
    }>;
    getExploitPatterns(): Promise<ExploitPattern[]>;
    getPatternDashboard(): Promise<any>;
    private detectExploits;
    private createAlert;
}
