import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { VotePredictionDto } from './dto/vote-prediction.dto';
import { ResolvePredictionDto } from './dto/resolve-prediction.dto';
import { PredictionStatus } from './entities/prediction.entity';
export declare class PredictionsController {
    private readonly predictionsService;
    constructor(predictionsService: PredictionsService);
    createPrediction(req: any, createPredictionDto: CreatePredictionDto): Promise<import("./entities/prediction.entity").Prediction>;
    voteOnPrediction(req: any, votePredictionDto: VotePredictionDto): Promise<import("./entities/prediction-vote.entity").PredictionVote>;
    resolvePrediction(req: any, resolvePredictionDto: ResolvePredictionDto): Promise<import("./entities/prediction.entity").Prediction>;
    getPredictionsByRoom(roomId: string, status?: PredictionStatus): Promise<import("./entities/prediction.entity").Prediction[]>;
    getPredictionById(id: string): Promise<import("./entities/prediction.entity").Prediction>;
    getUserPredictions(req: any): Promise<import("./entities/prediction.entity").Prediction[]>;
}
