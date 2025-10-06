import { Repository } from 'typeorm';
import { GatedRoom } from './entities/gated-room.entity';
import { CreateGatedRoomDto } from './dto/create-gated-room.dto';
import { CheckAccessDto, AccessStatusDto } from './dto/check-access.dto';
export declare class GatedRoomsService {
    private gatedRoomRepository;
    private readonly logger;
    private server;
    constructor(gatedRoomRepository: Repository<GatedRoom>);
    createGatedRoom(createGatedRoomDto: CreateGatedRoomDto): Promise<GatedRoom>;
    findAll(): Promise<GatedRoom[]>;
    findOne(id: string): Promise<GatedRoom>;
    findByRoomId(roomId: string): Promise<GatedRoom | null>;
    checkAccess(checkAccessDto: CheckAccessDto): Promise<AccessStatusDto>;
    private verifyGateRule;
    private verifyTokenHolding;
    private verifyNftHolding;
    deleteGatedRoom(id: string): Promise<void>;
}
