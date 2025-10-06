import { PodcastRoomsService } from './services/podcast-rooms.service';
import { PodcastRoomResponseDto, UpdatePodcastRoomDto } from './dto/update-podcast-room.dto';
import { CreatePodcastRoomDto } from './dto/create-podcast-room.dto';
export declare class PodcastRoomsController {
    private readonly podcastRoomsService;
    constructor(podcastRoomsService: PodcastRoomsService);
    create(createPodcastRoomDto: CreatePodcastRoomDto): Promise<PodcastRoomResponseDto>;
    findAll(creatorId?: string): Promise<PodcastRoomResponseDto[]>;
    findOne(id: string): Promise<PodcastRoomResponseDto>;
    findByRoomId(roomId: string): Promise<PodcastRoomResponseDto>;
    getAudioUrl(roomId: string): Promise<{
        audioUrl: string;
    }>;
    update(id: string, updatePodcastRoomDto: UpdatePodcastRoomDto): Promise<PodcastRoomResponseDto>;
    remove(id: string): Promise<void>;
    verifyAccess(roomId: string): Promise<{
        hasAccess: boolean;
    }>;
}
