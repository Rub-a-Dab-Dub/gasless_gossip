import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request, 
  Param, 
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { VotePredictionDto } from './dto/vote-prediction.dto';
import { ResolvePredictionDto } from './dto/resolve-prediction.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PredictionStatus } from './entities/prediction.entity';

@Controller('predictions')
@UseGuards(AuthGuard)
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPrediction(@Request() req: any, @Body() createPredictionDto: CreatePredictionDto) {
    const userId = req.user.id;
    return this.predictionsService.createPrediction(userId, createPredictionDto);
  }

  @Post('vote')
  @HttpCode(HttpStatus.CREATED)
  async voteOnPrediction(@Request() req: any, @Body() votePredictionDto: VotePredictionDto) {
    const userId = req.user.id;
    return this.predictionsService.voteOnPrediction(userId, votePredictionDto);
  }

  @Post('resolve')
  @HttpCode(HttpStatus.OK)
  async resolvePrediction(@Request() req: any, @Body() resolvePredictionDto: ResolvePredictionDto) {
    const userId = req.user.id;
    return this.predictionsService.resolvePrediction(userId, resolvePredictionDto);
  }

  @Get('room/:roomId')
  async getPredictionsByRoom(
    @Param('roomId') roomId: string,
    @Query('status') status?: PredictionStatus,
  ) {
    return this.predictionsService.getPredictionsByRoom(roomId, status);
  }

  @Get(':id')
  async getPredictionById(@Param('id') id: string) {
    return this.predictionsService.getPredictionById(id);
  }

  @Get('user/my-predictions')
  async getUserPredictions(@Request() req: any) {
    const userId = req.user.id;
    return this.predictionsService.getUserPredictions(userId);
  }
}
