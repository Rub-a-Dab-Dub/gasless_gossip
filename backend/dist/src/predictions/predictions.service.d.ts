import { Repository, DataSource } from 'typeorm';
import { Prediction, PredictionStatus } from './entities/prediction.entity';
import { PredictionVote } from './entities/prediction-vote.entity';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { VotePredictionDto } from './dto/vote-prediction.dto';
import { ResolvePredictionDto } from './dto/resolve-prediction.dto';
import { StellarService } from '../stellar/stellar.service';
export declare class PredictionsService {
    private predictionRepository;
    private predictionVoteRepository;
    private dataSource;
    private stellarService;
    private readonly logger;
    constructor(predictionRepository: Repository<Prediction>, predictionVoteRepository: Repository<PredictionVote>, dataSource: DataSource, stellarService: StellarService);
    createPrediction(userId: string, createPredictionDto: CreatePredictionDto): Promise<Prediction>;
    voteOnPrediction(userId: string, votePredictionDto: VotePredictionDto): Promise<PredictionVote>;
    resolvePrediction(userId: string, resolvePredictionDto: ResolvePredictionDto): Promise<Prediction>;
    getPredictionsByRoom(roomId: string, status?: PredictionStatus): Promise<Prediction[]>;
    getPredictionById(id: string): Promise<Prediction>;
    getUserPredictions(userId: string): Promise<Prediction[]>;
    private updatePredictionVoteCounts;
    private calculateAndDistributeRewards;
}
