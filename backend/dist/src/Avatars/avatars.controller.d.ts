import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarResponseDto } from './dto/avatar-response.dto';
export declare class AvatarsController {
    private readonly avatarsService;
    constructor(avatarsService: AvatarsService);
    mintAvatar(createAvatarDto: CreateAvatarDto, req: any): Promise<AvatarResponseDto>;
    getAvatar(userId: string): Promise<AvatarResponseDto>;
    getAllAvatars(): Promise<AvatarResponseDto[]>;
}
