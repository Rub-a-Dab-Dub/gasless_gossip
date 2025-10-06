import type { Repository } from "typeorm";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Visit } from "../entities/visit.entity";
import type { CreateVisitDto } from "../dto/create-visit.dto";
import type { VisitStatsDto } from "../dto/visit-stats.dto";
export declare class VisitsService {
    private readonly visitRepository;
    private readonly eventEmitter;
    private readonly logger;
    constructor(visitRepository: Repository<Visit>, eventEmitter: EventEmitter2);
    createVisit(createVisitDto: CreateVisitDto): Promise<Visit>;
    getVisitsByRoom(roomId: string, limit?: number, offset?: number): Promise<Visit[]>;
    getVisitsByUser(userId: string, limit?: number, offset?: number): Promise<Visit[]>;
    getVisitStats(roomId: string): Promise<VisitStatsDto>;
    private getTotalVisits;
    private getUniqueVisitors;
    private getAverageDuration;
    private getLastVisit;
    private getDailyVisits;
    private getPeakHour;
    getPopularRooms(limit?: number): Promise<{
        roomId: string;
        visitCount: number;
    }[]>;
    deleteOldVisits(daysOld?: number): Promise<number>;
}
