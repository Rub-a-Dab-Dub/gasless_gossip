import { Repository } from 'typeorm';
import { RoomTag } from './entities/room-tag.entity';
import { Room } from '../rooms/entities/room.entity';
import { RoomMembership } from '../rooms/entities/room-membership.entity';
import { CreateRoomTagDto, CreateMultipleRoomTagsDto } from './dto/create-room-tag.dto';
import { SearchRoomsByTagDto, SearchRoomsByMultipleTagsDto } from './dto/search-rooms-by-tag.dto';
import { DeleteRoomTagDto } from './dto/delete-room-tag.dto';
export interface TaggedRoom {
    id: string;
    name: string;
    description?: string;
    type: string;
    maxMembers: number;
    createdBy: string;
    isActive: boolean;
    minLevel: number;
    minXp: number;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    memberCount?: number;
}
export declare class RoomTagsService {
    private readonly roomTagRepository;
    private readonly roomRepository;
    private readonly membershipRepository;
    constructor(roomTagRepository: Repository<RoomTag>, roomRepository: Repository<Room>, membershipRepository: Repository<RoomMembership>);
    createRoomTag(createRoomTagDto: CreateRoomTagDto, userId: string): Promise<RoomTag>;
    createMultipleRoomTags(createMultipleTagsDto: CreateMultipleRoomTagsDto, userId: string): Promise<RoomTag[]>;
    deleteRoomTag(deleteRoomTagDto: DeleteRoomTagDto, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getRoomTags(roomId: string): Promise<RoomTag[]>;
    searchRoomsByTag(searchDto: SearchRoomsByTagDto): Promise<{
        rooms: TaggedRoom[];
        total: number;
    }>;
    searchRoomsByMultipleTags(searchDto: SearchRoomsByMultipleTagsDto): Promise<{
        rooms: TaggedRoom[];
        total: number;
    }>;
    getAllTags(): Promise<{
        tagName: string;
        roomCount: number;
    }[]>;
    getPopularTags(limit?: number): Promise<{
        tagName: string;
        roomCount: number;
    }[]>;
    private validateRoomCreatorPermission;
    private enrichRoomsWithTagsAndCounts;
}
