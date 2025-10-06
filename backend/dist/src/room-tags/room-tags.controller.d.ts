import { RoomTagsService } from './room-tags.service';
import { CreateRoomTagDto, CreateMultipleRoomTagsDto } from './dto/create-room-tag.dto';
import { SearchRoomsByMultipleTagsDto } from './dto/search-rooms-by-tag.dto';
import { DeleteRoomTagDto } from './dto/delete-room-tag.dto';
export declare class RoomTagsController {
    private readonly roomTagsService;
    constructor(roomTagsService: RoomTagsService);
    createRoomTag(req: any, createRoomTagDto: CreateRoomTagDto): Promise<import("./entities/room-tag.entity").RoomTag>;
    createMultipleRoomTags(req: any, createMultipleTagsDto: CreateMultipleRoomTagsDto): Promise<import("./entities/room-tag.entity").RoomTag[]>;
    deleteRoomTag(req: any, deleteRoomTagDto: DeleteRoomTagDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getRoomTags(roomId: string): Promise<import("./entities/room-tag.entity").RoomTag[]>;
    searchRoomsByTag(tag: string, limit?: number, offset?: number): Promise<{
        rooms: import("./room-tags.service").TaggedRoom[];
        total: number;
    }>;
    searchRoomsByMultipleTags(searchDto: SearchRoomsByMultipleTagsDto): Promise<{
        rooms: import("./room-tags.service").TaggedRoom[];
        total: number;
    }>;
    getPopularTags(limit?: number): Promise<{
        tagName: string;
        roomCount: number;
    }[]>;
    getAllTags(): Promise<{
        tagName: string;
        roomCount: number;
    }[]>;
}
