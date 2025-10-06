import { Repository } from 'typeorm';
export declare class QuestsService {
    private questRepository;
    private progressRepository;
    private auditRepository;
    private frenzyRepository;
    constructor(questRepository: Repository<Quest>, progressRepository: Repository<UserQuestProgress>, auditRepository: Repository<QuestCompletionAudit>, frenzyRepository: Repository<FrenzyEvent>);
}
