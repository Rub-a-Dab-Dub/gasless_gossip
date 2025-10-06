import { Repository } from 'typeorm';
import { Avatar } from './entities/avatar.entity';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarResponseDto } from './dto/avatar-response.dto';
import { StellarNftService } from './services/stellar-nft.service';
export declare class AvatarsService {
    private avatarRepository;
    private stellarNftService;
    private readonly logger;
    constructor(avatarRepository: Repository<Avatar>, stellarNftService: StellarNftService);
    mintAvatar(userId: string, createAvatarDto: CreateAvatarDto, userStellarPublicKey: string): Promise<AvatarResponseDto>;
    getUserAvatar(userId: string): Promise<AvatarResponseDto>;
    getAllAvatars(): Promise<AvatarResponseDto[]>;
    deactivateAvatar(userId: string): Promise<void>;
    private mapToResponseDto;
}
