import { Repository, DataSource } from 'typeorm';
import { Room } from './entities/room.entity';
import { Participant } from './entities/participant.entity';
import { Message } from './entities/message.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { BulkUpdateRoomsDto } from './dto/bulk-update-rooms.dto';
import { RoomExpiryService } from './services/room-expiry.service';
export declare class RoomsService {
    private roomRepo;
    private participantRepo;
    private messageRepo;
    private transactionRepo;
    private dataSource;
    private expiryService;
    constructor(roomRepo: Repository<Room>, participantRepo: Repository<Participant>, messageRepo: Repository<Message>, transactionRepo: Repository<Transaction>, dataSource: DataSource, expiryService: RoomExpiryService);
    create(dto: CreateRoomDto, creatorId: string): Promise<Room>;
    findAll(query: QueryRoomsDto, isModerator: boolean): Promise<{
        data: Room[];
        meta: {
            page: QueryRoomsDto;
            limit: QueryRoomsDto;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, isModerator: boolean): Promise<Room>;
    update(id: string, dto: UpdateRoomDto): Promise<Room>;
    bulkUpdate(dto: BulkUpdateRoomsDto): Promise<{
        updated: number;
    }>;
    softDelete(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
