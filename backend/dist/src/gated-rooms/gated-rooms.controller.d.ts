import { GatedRoomsService } from './gated-rooms.service';
import { CreateGatedRoomDto } from './dto/create-gated-room.dto';
import { CheckAccessDto, AccessStatusDto } from './dto/check-access.dto';
export declare class GatedRoomsController {
    private readonly gatedRoomsService;
    private readonly logger;
    constructor(gatedRoomsService: GatedRoomsService);
    create(createGatedRoomDto: CreateGatedRoomDto): Promise<{
        success: boolean;
        data: import("./entities/gated-room.entity").GatedRoom;
        message: string;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./entities/gated-room.entity").GatedRoom[];
        count: number;
    }>;
    checkAccess(checkAccessDto: CheckAccessDto): Promise<AccessStatusDto>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/gated-room.entity").GatedRoom;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
