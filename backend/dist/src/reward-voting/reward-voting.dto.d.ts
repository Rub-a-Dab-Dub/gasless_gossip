export declare class CastRewardVoteDto {
    rewardId: string;
    userId: string;
    voteWeight: number;
    stellarAccountId?: string;
}
export declare class RewardsResultsQueryDto {
    rewardId: string;
}
export interface RewardResultItemDto {
    userId: string;
    voteWeight: number;
    stellarTxHash?: string;
}
export interface RewardResultsDto {
    rewardId: string;
    totalWeight: number;
    votes: RewardResultItemDto[];
}
