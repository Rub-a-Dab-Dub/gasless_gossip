import { RoomType } from '../entities/room.entity';
export declare class QueryRoomsDto {
    page?: number;
    limit?: number;
    type?: RoomType;
    creatorId?: string;
    activityLevel?: number;
    expiryWithinDays?: number;
    search?: string;
    pseudonymOnly?: boolean;
}
