import { Response } from 'express';
import { RoomsService } from './services/rooms.service';
import { RoomExportService } from './services/room-export.service';
import { RoomEventsGateway } from './events/room-events.gateway';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { BulkUpdateRoomsDto } from './dto/bulk-update-rooms.dto';
export declare class RoomsController {
    private readonly roomsService;
    private readonly exportService;
    private readonly eventsGateway;
    constructor(roomsService: RoomsService, exportService: RoomExportService, eventsGateway: RoomEventsGateway);
    create(dto: CreateRoomDto, req: any): Promise<Room>;
    findAll(query: QueryRoomsDto, req: any): Promise<{
        data: Room[];
        meta: {
            page: QueryRoomsDto;
            limit: QueryRoomsDto;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, req: any): Promise<Room>;
    update(id: string, dto: UpdateRoomDto): Promise<Room>;
    bulkUpdate(dto: BulkUpdateRoomsDto): Promise<{
        updated: number;
    }>;
    softDelete(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    exportActivity(id: string, res: Response): Promise<void>;
}
