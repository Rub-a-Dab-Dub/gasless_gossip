import { ChallengesService } from './services/challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { ChallengeResponseDto, ChallengeParticipationResponseDto, ChallengeStatsDto } from './dto/challenge-response.dto';
export declare class ChallengesController {
    private readonly challengesService;
    constructor(challengesService: ChallengesService);
    createChallenge(req: any, createChallengeDto: CreateChallengeDto): Promise<ChallengeResponseDto>;
    getChallenges(activeOnly?: string): Promise<ChallengeResponseDto[]>;
    getChallengeStats(): Promise<ChallengeStatsDto>;
    getUserChallenges(req: any): Promise<any>;
    getChallengeById(id: string): Promise<ChallengeResponseDto>;
    joinChallenge(req: any, joinChallengeDto: JoinChallengeDto): Promise<ChallengeParticipationResponseDto>;
    updateProgress(req: any, progressUpdate: {
        challengeId: string;
        progress: number;
        progressData?: Record<string, any>;
    }): Promise<import("./entities/challenge-participation.entity").ChallengeParticipation>;
}
