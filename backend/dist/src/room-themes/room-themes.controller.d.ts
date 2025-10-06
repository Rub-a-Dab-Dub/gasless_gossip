import { RoomThemesService } from './room-themes.service';
import { CreateRoomThemeDto } from './dto/create-room-theme.dto';
import { RoomThemeResponseDto } from './dto/room-theme-response.dto';
export declare class RoomThemesController {
    private readonly roomThemesService;
    constructor(roomThemesService: RoomThemesService);
    applyTheme(createRoomThemeDto: CreateRoomThemeDto, req: any): Promise<RoomThemeResponseDto>;
    getRoomTheme(roomId: string): Promise<RoomThemeResponseDto | null>;
}
