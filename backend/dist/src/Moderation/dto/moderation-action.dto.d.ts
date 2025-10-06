import { ActionType } from '../entities/moderation-action.entity';
export declare class CreateModerationActionDto {
    roomId: string;
    targetId: string;
    actionType: ActionType;
    reason?: string;
    expiresAt?: string;
}
export declare class ReverseModerationActionDto {
    roomId: string;
    targetId: string;
    actionType: ActionType;
    reason?: string;
}
