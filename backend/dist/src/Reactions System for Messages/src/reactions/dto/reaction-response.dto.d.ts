import { ReactionType } from '../entities/reaction.entity';
export declare class ReactionResponseDto {
    id: string;
    messageId: string;
    type: ReactionType;
    userId: string;
    createdAt: Date;
}
export declare class ReactionCountDto {
    messageId: string;
    totalCount: number;
    countByType: Record<ReactionType, number>;
}
