import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ReactionTrack } from './reactions-tracker.entity';
import { ReactionMetricsFilterDto, ReactionType } from './dto/reaction-metrics-filter.dto';
import { ReactionUpdateDto } from './dto/reaction-update.dto';
import { MostReactedSecretsResponseDto } from './dto/reaction-track-response.dto';

@Injectable()
export class ReactionsTrackerService {
  private readonly logger = new Logger(ReactionsTrackerService.name);

  constructor(
    @InjectRepository(ReactionTrack)
    private readonly reactionTrackRepository: Repository<ReactionTrack>,
  ) {}

  async getReactionsByMessageId(messageId: string): Promise<ReactionTrack | null> {
    try {
      const reactionTrack = await this.reactionTrackRepository.findOne({
        where: { messageId },
      });
      return reactionTrack;
    } catch (error) {
      this.logger.error(`Error fetching reactions for message ${messageId}`, error);
      throw error;
    }
  }

  async getMostReactedSecrets(
    filters: ReactionMetricsFilterDto,
  ): Promise<MostReactedSecretsResponseDto> {
    try {
      const queryBuilder = this.createFilteredQuery(filters);
      
      // Get total count for pagination
      const total = await queryBuilder.getCount();
      
      // Apply pagination and sorting
      queryBuilder
        .orderBy('rt.total_count', filters.sortOrder)
        .addOrderBy('rt.updated_at', 'DESC')
        .limit(filters.limit)
        .offset(filters.offset);

      const data = await queryBuilder.getMany();

      return {
        data,
        total,
        limit: filters.limit,
        offset: filters.offset,
      };
    } catch (error) {
      this.logger.error('Error fetching most reacted secrets', error);
      throw error;
    }
  }

  async aggregateReaction(reactionUpdate: ReactionUpdateDto): Promise<ReactionTrack> {
    try {
      let reactionTrack = await this.reactionTrackRepository.findOne({
        where: { messageId: reactionUpdate.messageId },
      });

      if (!reactionTrack) {
        reactionTrack = this.reactionTrackRepository.create({
          messageId: reactionUpdate.messageId,
          totalCount: 0,
          likeCount: 0,
          loveCount: 0,
          laughCount: 0,
          angryCount: 0,
          sadCount: 0,
        });
      }

      // Update specific reaction count
      const countField = `${reactionUpdate.reactionType}Count` as keyof ReactionTrack;
      (reactionTrack as any)[countField] += reactionUpdate.count;
      
      // Update total count
      reactionTrack.totalCount += reactionUpdate.count;

      return await this.reactionTrackRepository.save(reactionTrack);
    } catch (error) {
      this.logger.error(`Error aggregating reaction for message ${reactionUpdate.messageId}`, error);
      throw error;
    }
  }

  async removeReaction(reactionUpdate: ReactionUpdateDto): Promise<ReactionTrack> {
    try {
      const reactionTrack = await this.reactionTrackRepository.findOne({
        where: { messageId: reactionUpdate.messageId },
      });

      if (!reactionTrack) {
        throw new NotFoundException(`Reaction track not found for message ${reactionUpdate.messageId}`);
      }

      // Update specific reaction count
      const countField = `${reactionUpdate.reactionType}Count` as keyof ReactionTrack;
      const currentCount = (reactionTrack as any)[countField];
      
      if (currentCount >= reactionUpdate.count) {
        (reactionTrack as any)[countField] -= reactionUpdate.count;
        reactionTrack.totalCount -= reactionUpdate.count;
      } else {
        // Set to 0 if trying to remove more than available
        reactionTrack.totalCount -= currentCount;
        (reactionTrack as any)[countField] = 0;
      }

      return await this.reactionTrackRepository.save(reactionTrack);
    } catch (error) {
      this.logger.error(`Error removing reaction for message ${reactionUpdate.messageId}`, error);
      throw error;
    }
  }

  private createFilteredQuery(filters: ReactionMetricsFilterDto): SelectQueryBuilder<ReactionTrack> {
    const queryBuilder = this.reactionTrackRepository
      .createQueryBuilder('rt')
      .select([
        'rt.id',
        'rt.messageId',
        'rt.totalCount',
        'rt.likeCount',
        'rt.loveCount',
        'rt.laughCount',
        'rt.angryCount',
        'rt.sadCount',
        'rt.createdAt',
        'rt.updatedAt',
      ]);

    // Date filtering
    if (filters.dateFrom) {
      queryBuilder.andWhere('rt.created_at >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      queryBuilder.andWhere('rt.created_at <= :dateTo', { dateTo: filters.dateTo });
    }

    // Reaction type filtering
    if (filters.reactionType) {
      const countColumn = `rt.${filters.reactionType}_count`;
      queryBuilder.andWhere(`${countColumn} > 0`);
    }

    return queryBuilder;
  }
}

