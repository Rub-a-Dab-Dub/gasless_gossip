import { Repository } from 'typeorm';
import { ReactionTrack } from './reactions-tracker.entity';
import { ReactionMetricsFilterDto } from './dto/reaction-metrics-filter.dto';
import { ReactionUpdateDto } from './dto/reaction-update.dto';
import { MostReactedSecretsResponseDto } from './dto/reaction-track-response.dto';
export declare class ReactionsTrackerService {
    private readonly reactionTrackRepository;
    private readonly logger;
    constructor(reactionTrackRepository: Repository<ReactionTrack>);
    getReactionsByMessageId(messageId: string): Promise<ReactionTrack | null>;
    getMostReactedSecrets(filters: ReactionMetricsFilterDto): Promise<MostReactedSecretsResponseDto>;
    aggregateReaction(reactionUpdate: ReactionUpdateDto): Promise<ReactionTrack>;
    removeReaction(reactionUpdate: ReactionUpdateDto): Promise<ReactionTrack>;
    private createFilteredQuery;
}
