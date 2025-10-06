import { User } from "../../users/entities/user.entity";
export declare enum ActivityAction {
    MESSAGE_SENT = "message_sent",
    MESSAGE_RECEIVED = "message_received",
    TIP_SENT = "tip_sent",
    TIP_RECEIVED = "tip_received",
    ROOM_JOINED = "room_joined",
    ROOM_LEFT = "room_left",
    PROFILE_UPDATED = "profile_updated",
    BADGE_EARNED = "badge_earned",
    LEVEL_UP = "level_up",
    NFT_MINTED = "nft_minted",
    NFT_TRANSFERRED = "nft_transferred",
    LOGIN = "login",
    LOGOUT = "logout"
}
export declare class ActivityLog {
    id: string;
    userId: string;
    action: ActivityAction;
    metadata: Record<string, any>;
    roomId: string;
    targetUserId: string;
    amount: number;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    user: User;
    targetUser: User;
}
