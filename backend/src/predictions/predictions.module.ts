import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { Prediction } from './entities/prediction.entity';
import { PredictionVote } from './entities/prediction-vote.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';
import { StellarService } from '../stellar/stellar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction, PredictionVote, Room, User]),
  ],
  controllers: [PredictionsController],
  providers: [PredictionsService, StellarService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
