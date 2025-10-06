import { VoiceDropsService } from '../services/voice-drops.service';
import { CreateVoiceDropDto, VoiceDropResponseDto, GetVoiceDropsDto } from '../dto';
export declare class VoiceDropsController {
    private voiceDropsService;
    constructor(voiceDropsService: VoiceDropsService);
    createVoiceDrop(createVoiceDropDto: CreateVoiceDropDto, audioFile: Express.Multer.File): Promise<VoiceDropResponseDto>;
    getVoiceDropsByRoom(roomId: string, query: GetVoiceDropsDto): Promise<{
        data: VoiceDropResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getVoiceDropById(id: string): Promise<VoiceDropResponseDto>;
    deleteVoiceDrop(id: string): Promise<void>;
}
