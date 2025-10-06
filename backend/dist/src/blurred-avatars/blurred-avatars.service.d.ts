import { Repository } from 'typeorm';
import { BlurredAvatar } from './entities/blurred-avatar.entity';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';
import { UpdateBlurredAvatarDto } from './dto/update-blurred-avatar.dto';
import { ConfigService } from '@nestjs/config';
export declare class BlurredAvatarsService {
    private blurredAvatarRepository;
    private configService;
    private readonly logger;
    private readonly uploadPath;
    constructor(blurredAvatarRepository: Repository<BlurredAvatar>, configService: ConfigService);
    private ensureUploadDirectory;
    createBlurredAvatar(createBlurredAvatarDto: CreateBlurredAvatarDto): Promise<BlurredAvatar>;
    findAllByUserId(userId: string): Promise<BlurredAvatar[]>;
    findLatestByUserId(userId: string): Promise<BlurredAvatar | null>;
    updateBlurredAvatar(id: string, updateBlurredAvatarDto: UpdateBlurredAvatarDto): Promise<BlurredAvatar>;
    remove(id: string): Promise<void>;
    private processImage;
    getBlurredAvatarStats(userId: string): Promise<{
        totalAvatars: number;
        latestBlurLevel: number | null;
        lastUpdated: Date | null;
    }>;
}
