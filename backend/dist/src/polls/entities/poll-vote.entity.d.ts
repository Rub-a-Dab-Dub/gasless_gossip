import { Poll } from './poll.entity';
export declare class PollVote {
    id: string;
    pollId: string;
    poll: Poll;
    userId: string;
    optionIndex: number;
    weight: number;
    createdAt: Date;
}
