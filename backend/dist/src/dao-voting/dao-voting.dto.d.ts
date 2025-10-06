export declare enum VoteChoice {
    YES = "yes",
    NO = "no",
    ABSTAIN = "abstain"
}
export declare class CreateVoteDto {
    proposalId: string;
    userId: string;
    choice: VoteChoice;
    weight: number;
    stellarAccountId: string;
    stellarTransactionHash?: string;
}
export declare class VotingResultDto {
    proposalId: string;
    totalVotes: number;
    totalWeight: number;
    yesVotes: number;
    noVotes: number;
    abstainVotes: number;
    yesWeight: number;
    noWeight: number;
    abstainWeight: number;
    participationRate: number;
    weightedApprovalRate: number;
    votes: VoteDetailDto[];
}
export declare class VoteDetailDto {
    id: string;
    userId: string;
    choice: string;
    weight: number;
    stellarTransactionHash: string;
    createdAt: Date;
}
export declare class ProposalValidationDto {
    proposalId: string;
    title: string;
    description: string;
    minimumVotingWeight: number;
    votingPeriodHours: number;
}
