import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTheme } from './entities/room-theme.entity';
import { CreateRoomThemeDto } from './dto/create-room-theme.dto';
import { RoomThemeResponseDto } from './dto/room-theme-response.dto';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class RoomThemesService {
  constructor(
    @InjectRepository(RoomTheme)
    private roomThemesRepository: Repository<RoomTheme>,
    @Inject(StellarService)
    private stellarService: StellarService,
  ) {}

  async applyTheme(createRoomThemeDto: CreateRoomThemeDto, userId: string): Promise<RoomThemeResponseDto> {
    
    const isPremium = await this.stellarService.verifyPremiumThemeOwnership(userId, createRoomThemeDto.themeId);
    if (!isPremium) {
      throw new ForbiddenException('User does not own the required premium theme token');
    }

   
    let roomTheme = await this.roomThemesRepository.findOne({
      where: { roomId: createRoomThemeDto.roomId },
    });

    if (roomTheme) {
      
      roomTheme.themeId = createRoomThemeDto.themeId;
      roomTheme.metadata = createRoomThemeDto.metadata || roomTheme.metadata;
      const updated = await this.roomThemesRepository.save(roomTheme);
      return this.toResponseDto(updated);
    } else {
     
      const newRoomTheme = this.roomThemesRepository.create({
        roomId: createRoomThemeDto.roomId,
        themeId: createRoomThemeDto.themeId,
        metadata: createRoomThemeDto.metadata,
      });
      const saved = await this.roomThemesRepository.save(newRoomTheme);
      return this.toResponseDto(saved);
    }
  }

  async getRoomTheme(roomId: string): Promise<RoomThemeResponseDto | null> {
    const roomTheme = await this.roomThemesRepository.findOne({
      where: { roomId },
    });

    return roomTheme ? this.toResponseDto(roomTheme) : null;
  }

  private toResponseDto(roomTheme: RoomTheme): RoomThemeResponseDto {
    return {
      id: roomTheme.id,
      roomId: roomTheme.roomId,
      themeId: roomTheme.themeId,
      metadata: roomTheme.metadata,
      createdAt: roomTheme.createdAt,
      updatedAt: roomTheme.updatedAt,
    };
  }
}