import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReactionsTrackerService } from './reactions-tracker.service';
import { ReactionMetricsFilterDto } from './dto/reaction-metrics-filter.dto';
import { ReactionUpdateDto } from './dto/reaction-update.dto';
import { 
  ReactionTrackResponseDto, 
  MostReactedSecretsResponseDto 
} from './dto/reaction-track-response.dto';

@ApiTags('reactions-tracker')
@Controller('reactions-tracker')
export class ReactionsTrackerController {
  constructor(private readonly reactionsTrackerService: ReactionsTrackerService) {}

  @Get(':messageId')
  @ApiOperation({ summary: 'Get reaction counts for a specific message' })
  @ApiParam({ name: 'messageId', description: 'UUID of the message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reaction counts retrieved successfully',
    type: ReactionTrackResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No reactions found for this message',
  })
  async getReactionsByMessageId(@Param('messageId') messageId: string) {
    const reactions = await this.reactionsTrackerService.getReactionsByMessageId(messageId);
    
    if (!reactions) {
      throw new NotFoundException(`No reactions found for message ${messageId}`);
    }
    
    return reactions;
  }

  @Get()
  @ApiOperation({ summary: 'Get most reacted secrets with filtering options' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Most reacted secrets retrieved successfully',
    type: MostReactedSecretsResponseDto,
  })
  async getMostReactedSecrets(@Query() filters: ReactionMetricsFilterDto) {
    return await this.reactionsTrackerService.getMostReactedSecrets(filters);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a reaction to a message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reaction added successfully',
    type: ReactionTrackResponseDto,
  })
  async addReaction(@Body() reactionUpdate: ReactionUpdateDto) {
    return await this.reactionsTrackerService.aggregateReaction(reactionUpdate);
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove a reaction from a message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reaction removed successfully',
    type: ReactionTrackResponseDto,
  })
  async removeReaction(@Body() reactionUpdate: ReactionUpdateDto) {
    return await this.reactionsTrackerService.removeReaction(reactionUpdate);
  }
}

// reactions-tracker.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionsTrackerController } from './reactions-tracker.controller';
import { ReactionsTrackerService } from './reactions-tracker.service';
import { ReactionsTrackerGateway } from './reactions-tracker.gateway';
import { ReactionTrack } from './reactions-tracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReactionTrack])],
  controllers: [ReactionsTrackerController],
  providers: [ReactionsTrackerService, ReactionsTrackerGateway],
  exports: [ReactionsTrackerService],
})
export class ReactionsTrackerModule {}

