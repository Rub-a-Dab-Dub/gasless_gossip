import type { Request } from "express";
import type { VisitsService } from "../services/visits.service";
import type { CreateVisitDto } from "../dto/create-visit.dto";
import { VisitResponseDto } from "../dto/visit-response.dto";
import { VisitStatsDto } from "../dto/visit-stats.dto";
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    createVisit(createVisitDto: CreateVisitDto, request: Request): Promise<VisitResponseDto>;
    getVisitsByRoom(roomId: string, limit: number, offset: number): Promise<VisitResponseDto[]>;
    getVisitsByUser(userId: string, limit: number, offset: number): Promise<VisitResponseDto[]>;
    getVisitStats(roomId: string): Promise<VisitStatsDto>;
    getPopularRooms(limit: number): Promise<{
        roomId: string;
        visitCount: number;
    }[]>;
}
