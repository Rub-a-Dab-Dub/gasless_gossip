import { PollVote } from './poll-vote.entity';
export declare class Poll {
    id: string;
    roomId: string;
    question: string;
    options: string[];
    createdAt: Date;
    votes: PollVote[];
}
