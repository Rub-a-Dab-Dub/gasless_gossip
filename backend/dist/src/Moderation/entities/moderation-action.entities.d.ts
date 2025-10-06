export declare enum ActionType {
    BAN = "ban",
    KICK = "kick",
    UNBAN = "unban",
    MUTE = "mute",
    UNMUTE = "unmute",
    WARN = "warn"
}
export declare class ModerationAction {
    id: string;
    roomId: string;
    targetId: string;
    moderatorId: string;
    actionType: ActionType;
    reason?: string;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
