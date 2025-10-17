import { RoomCategory } from '../../room-categories/entities/room-category.entity';
import { Room } from '../entities/room.entity';

export class RoomResponseDto {
  id: number;
  name: string;
  code: string;
  type: string;
  duration: number;
  fee: number;
  createdAt: Date;
  room_category?: RoomCategory;

  constructor(room: Room) {
    Object.assign(this, room);
  }
}
