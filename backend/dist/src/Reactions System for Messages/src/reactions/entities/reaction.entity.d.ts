export declare enum ReactionType {
    LIKE = "like",
    LOVE = "love",
    LAUGH = "laugh",
    WOW = "wow",
    SAD = "sad",
    ANGRY = "angry"
}
export declare class Reaction {
    id: string;
    messageId: string;
    type: ReactionType;
    userId: string;
    createdAt: Date;
}
