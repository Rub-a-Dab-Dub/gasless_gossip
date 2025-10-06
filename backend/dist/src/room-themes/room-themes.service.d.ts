import { Repository } from 'typeorm';
import { RoomTheme } from './entities/room-theme.entity';
import { CreateRoomThemeDto } from './dto/create-room-theme.dto';
import { RoomThemeResponseDto } from './dto/room-theme-response.dto';
import { StellarService } from '../stellar/stellar.service';
export declare class RoomThemesService {
    private roomThemesRepository;
    private stellarService;
    constructor(roomThemesRepository: Repository<RoomTheme>, stellarService: StellarService);
    applyTheme(createRoomThemeDto: CreateRoomThemeDto, userId: string): Promise<RoomThemeResponseDto>;
    getRoomTheme(roomId: string): Promise<RoomThemeResponseDto | null>;
    private toResponseDto;
}
