import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
export declare class Participant {
    id: string;
    userId: string;
    roomId: string;
    pseudonym: string;
    user: User;
    room: Room;
}
