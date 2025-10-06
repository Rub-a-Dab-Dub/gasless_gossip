import { Server, Socket } from 'socket.io';
import { ReactionsTrackerService } from './reactions-tracker.service';
import { ReactionUpdateDto } from './dto/reaction-metrics-filter.dto';
export declare class ReactionsTrackerGateway {
    private readonly reactionsTrackerService;
    server: Server;
    private readonly logger;
    constructor(reactionsTrackerService: ReactionsTrackerService);
    handleAddReaction(reactionUpdate: ReactionUpdateDto, client: Socket): Promise<void>;
    handleRemoveReaction(reactionUpdate: ReactionUpdateDto, client: Socket): Promise<void>;
}
