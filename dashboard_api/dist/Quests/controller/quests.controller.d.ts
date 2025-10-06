export declare class QuestsController {
    private readonly questsService;
    constructor(questsService: QuestsService);
    create(createQuestDto: CreateQuestDto): any;
    findAll(status?: QuestStatus): any;
    findOne(id: string): any;
    update(id: string, updateQuestDto: UpdateQuestDto): any;
    remove(id: string): any;
    getStats(id: string): any;
    incrementProgress(questId: string, userId: string, amount?: number): any;
    getUserProgress(userId: string): any;
    getUserStreaks(userId: string): any;
    getHistory(userId: string, questId?: string): any;
    createFrenzy(body: {
        name: string;
        description: string;
        multiplier: number;
        startsAt: Date;
        endsAt: Date;
        questIds?: string[];
    }): any;
    getActiveFrenzy(questId?: string): any;
    applyBoost(dto: ApplyFrenzyBoostDto): any;
    detectDuplicates(): any;
}
