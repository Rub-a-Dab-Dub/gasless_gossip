import { Repository } from 'typeorm';
import { PodcastRoom } from '../entities/podcast-room.entity';
import { CreatePodcastRoomDto } from '../dto/create-podcast-room.dto';
import { UpdatePodcastRoomDto } from '../dto/update-podcast-room.dto';
import { StellarService } from './stellar.service';
import { IPFSService } from './ipfs.service';
export declare class PodcastRoomsService {
    private readonly podcastRoomRepository;
    private readonly stellarService;
    private readonly ipfsService;
    constructor(podcastRoomRepository: Repository<PodcastRoom>, stellarService: StellarService, ipfsService: IPFSService);
    create(createPodcastRoomDto: CreatePodcastRoomDto): Promise<PodcastRoom>;
    findAll(creatorId?: string): Promise<PodcastRoom[]>;
    findOne(id: string): Promise<PodcastRoom>;
    findByRoomId(roomId: string): Promise<PodcastRoom>;
    update(id: string, updatePodcastRoomDto: UpdatePodcastRoomDto, requestingUserId: string): Promise<PodcastRoom>;
    remove(id: string, requestingUserId: string): Promise<void>;
    verifyAccess(roomId: string, userId: string): Promise<boolean>;
    getAudioUrl(roomId: string): Promise<string>;
}
