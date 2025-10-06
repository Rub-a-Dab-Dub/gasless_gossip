import { ReactionsTrackerService } from './reactions-tracker.service';
import { ReactionMetricsFilterDto } from './dto/reaction-metrics-filter.dto';
import { ReactionUpdateDto } from './dto/reaction-update.dto';
export declare class ReactionsTrackerController {
    private readonly reactionsTrackerService;
    constructor(reactionsTrackerService: ReactionsTrackerService);
    getReactionsByMessageId(messageId: string): Promise<any>;
    getMostReactedSecrets(filters: ReactionMetricsFilterDto): Promise<MostReactedSecretsResponseDto>;
    addReaction(reactionUpdate: ReactionUpdateDto): Promise<ReactionTrack>;
    removeReaction(reactionUpdate: ReactionUpdateDto): Promise<ReactionTrack>;
}
export declare class ReactionsTrackerModule {
}
