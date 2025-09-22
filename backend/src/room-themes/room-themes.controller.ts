import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RoomThemesService } from './room-themes.service';
import { CreateRoomThemeDto } from './dto/create-room-theme.dto';
import { RoomThemeResponseDto } from './dto/room-theme-response.dto';


@Controller('room-themes')
export class RoomThemesController {
  constructor(private readonly roomThemesService: RoomThemesService) {}

  @Post()
  async applyTheme(
    @Body() createRoomThemeDto: CreateRoomThemeDto,
    @Request() req: any, 
  ): Promise<RoomThemeResponseDto> {

    const userId = req.user?.id || 'mock-user-id'; 
    return this.roomThemesService.applyTheme(createRoomThemeDto, userId);
  }

  @Get(':roomId')
  async getRoomTheme(@Param('roomId') roomId: string): Promise<RoomThemeResponseDto | null> {
    return this.roomThemesService.getRoomTheme(roomId);
  }
}