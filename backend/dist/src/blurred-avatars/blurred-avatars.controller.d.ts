import { BlurredAvatarsService } from './blurred-avatars.service';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';
import { UpdateBlurredAvatarDto } from './dto/update-blurred-avatar.dto';
export declare class BlurredAvatarsController {
    private readonly blurredAvatarsService;
    constructor(blurredAvatarsService: BlurredAvatarsService);
    createBlurredAvatar(createBlurredAvatarDto: CreateBlurredAvatarDto): Promise<{
        success: boolean;
        message: string;
        data: import(".").BlurredAvatar;
    }>;
    getBlurredAvatars(userId: string, latest?: string): Promise<{
        success: boolean;
        message: string;
        data: import(".").BlurredAvatar | null;
    } | {
        success: boolean;
        message: string;
        data: import(".").BlurredAvatar[];
    }>;
    getBlurredAvatarStats(userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            totalAvatars: number;
            latestBlurLevel: number | null;
            lastUpdated: Date | null;
        };
    }>;
    updateBlurredAvatar(id: string, updateBlurredAvatarDto: UpdateBlurredAvatarDto): Promise<{
        success: boolean;
        message: string;
        data: import(".").BlurredAvatar;
    }>;
    removeBlurredAvatar(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
