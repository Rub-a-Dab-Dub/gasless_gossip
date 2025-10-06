import { PollsService } from './services/polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteDto } from './dto/vote.dto';
export declare class PollsController {
    private readonly pollsService;
    constructor(pollsService: PollsService);
    create(req: any, dto: CreatePollDto): Promise<import("./entities/poll.entity").Poll>;
    vote(req: any, dto: VoteDto): Promise<{
        poll: import("./entities/poll.entity").Poll;
        tallies: number[];
        weights: number[];
    }>;
    list(req: any, roomId: string): Promise<import("./entities/poll.entity").Poll[]>;
}
