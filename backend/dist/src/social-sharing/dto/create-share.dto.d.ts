import { ContentType, Platform } from '../entities/share.entity';
export declare class CreateShareDto {
    contentType: ContentType;
    contentId?: string;
    platform: Platform;
    shareText?: string;
    metadata?: Record<string, any>;
}
export declare class ShareResponseDto {
    id: string;
    userId: string;
    contentType: ContentType;
    contentId?: string;
    platform: Platform;
    shareUrl?: string;
    externalUrl?: string;
    shareText?: string;
    metadata?: Record<string, any>;
    xpAwarded: number;
    stellarTxId?: string;
    isSuccessful: boolean;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
