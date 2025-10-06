import { ContentType, Platform } from '../entities/share.entity';
export declare class ShareQueryDto {
    userId?: string;
    contentType?: ContentType;
    platform?: Platform;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}
