import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { PollVote } from '../entities/poll-vote.entity';
import { CreatePollDto } from '../dto/create-poll.dto';
import { VoteDto } from '../dto/vote.dto';
import { RoomAccessService } from '../../invitations/services/room-access.service';
import { UsersService } from '../../users/users.service';
export declare class PollsService {
    private readonly pollRepo;
    private readonly voteRepo;
    private readonly roomAccess;
    private readonly usersService;
    private readonly logger;
    private server;
    constructor(pollRepo: Repository<Poll>, voteRepo: Repository<PollVote>, roomAccess: RoomAccessService, usersService: UsersService);
    createPoll(dto: CreatePollDto, creatorId: string): Promise<Poll>;
    listPollsForRoom(roomId: string, requesterId: string): Promise<Poll[]>;
    vote(dto: VoteDto, userId: string): Promise<{
        poll: Poll;
        tallies: number[];
        weights: number[];
    }>;
    tallyPoll(pollId: string): Promise<{
        tallies: number[];
        weights: number[];
    }>;
    private getStellarWeightForUser;
}
