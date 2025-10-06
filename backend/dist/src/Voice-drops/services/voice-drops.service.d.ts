import { Repository } from 'typeorm';
import { VoiceDrop } from '../entities/voice-drop.entity';
import { CreateVoiceDropDto, VoiceDropResponseDto, GetVoiceDropsDto } from '../dto';
import { IpfsService } from './ipfs.service';
import { StellarService } from './stellar.service';
export declare class VoiceDropsService {
    private voiceDropRepository;
    private ipfsService;
    private stellarService;
    constructor(voiceDropRepository: Repository<VoiceDrop>, ipfsService: IpfsService, stellarService: StellarService);
    createVoiceDrop(createVoiceDropDto: CreateVoiceDropDto, audioFile: Express.Multer.File, userId: string): Promise<VoiceDropResponseDto>;
    getVoiceDropsByRoom(roomId: string, query: GetVoiceDropsDto, userId: string): Promise<{
        data: VoiceDropResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getVoiceDropById(id: string, userId: string): Promise<VoiceDropResponseDto>;
    deleteVoiceDrop(id: string, userId: string): Promise<void>;
    private toResponseDto;
    private validateRoomAccess;
}
