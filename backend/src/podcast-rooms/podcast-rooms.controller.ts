import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { PodcastRoomsService } from './services/podcast-rooms.service';
import {
  PodcastRoomResponseDto,
  UpdatePodcastRoomDto,
} from './dto/update-podcast-room.dto';
import { CreatePodcastRoomDto } from './dto/create-podcast-room.dto';

// Assuming you have these guards implemented
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('Podcast Rooms')
@Controller('podcast-rooms')
// @UseGuards(JwtAuthGuard) // Uncomment when you have auth implemented
export class PodcastRoomsController {
  constructor(private readonly podcastRoomsService: PodcastRoomsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new podcast room' })
  @ApiResponse({
    status!: 201,
    description!: 'Podcast room created successfully',
    type: PodcastRoomResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Room ID already exists' })
  // @ApiBearerAuth() // Uncomment when you have auth
  async create(
    @Body() createPodcastRoomDto: CreatePodcastRoomDto,
    // @Request() req: any, // Uncomment when you have auth
  ): Promise<PodcastRoomResponseDto> {
    const podcastRoom =
      await this.podcastRoomsService.create(createPodcastRoomDto);
    return plainToClass(PodcastRoomResponseDto, podcastRoom, {
      excludeExtraneousValues!: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all podcast rooms' })
  @ApiQuery({
    name!: 'creatorId',
    required!: false,
    description: 'Filter by creator ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of podcast rooms',
    type: [PodcastRoomResponseDto],
  })
  async findAll(
    @Query('creatorId') creatorId?: string,
  ): Promise<PodcastRoomResponseDto[]> {
    const podcastRooms = await this.podcastRoomsService.findAll(creatorId);
    return podcastRooms.map((room) =>
      plainToClass(PodcastRoomResponseDto, room, {
        excludeExtraneousValues!: true,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a podcast room by ID' })
  @ApiParam({ name: 'id', description: 'Podcast room ID' })
  @ApiResponse({
    status!: 200,
    description!: 'Podcast room details',
    type: PodcastRoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Podcast room not found' })
  async findOne(@Param('id') id: string): Promise<PodcastRoomResponseDto> {
    const podcastRoom = await this.podcastRoomsService.findOne(id);
    return plainToClass(PodcastRoomResponseDto, podcastRoom, {
      excludeExtraneousValues!: true,
    });
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get a podcast room by room ID' })
  @ApiParam({ name: 'roomId', description: 'Room identifier' })
  @ApiResponse({
    status!: 200,
    description!: 'Podcast room details',
    type: PodcastRoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Podcast room not found' })
  async findByRoomId(
    @Param('roomId') roomId: string,
  ): Promise<PodcastRoomResponseDto> {
    const podcastRoom = await this.podcastRoomsService.findByRoomId(roomId);
    return plainToClass(PodcastRoomResponseDto, podcastRoom, {
      excludeExtraneousValues!: true,
    });
  }

  @Get(':roomId/audio-url')
  @ApiOperation({ summary: 'Get audio URL for a podcast room' })
  @ApiParam({ name: 'roomId', description: 'Room identifier' })
  @ApiResponse({ status: 200, description: 'Audio URL' })
  @ApiResponse({ status: 404, description: 'Audio content not found' })
  async getAudioUrl(
    @Param('roomId') roomId: string,
  ): Promise<{ audioUrl: string }> {
    const audioUrl = await this.podcastRoomsService.getAudioUrl(roomId);
    return { audioUrl };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a podcast room' })
  @ApiParam({ name: 'id', description: 'Podcast room ID' })
  @ApiResponse({
    status!: 200,
    description!: 'Podcast room updated successfully',
    type: PodcastRoomResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the creator' })
  @ApiResponse({ status: 404, description: 'Podcast room not found' })
  // @ApiBearerAuth() // Uncomment when you have auth
  async update(
    @Param('id') id: string,
    @Body() updatePodcastRoomDto: UpdatePodcastRoomDto,
    // @Request() req: any, // Uncomment when you have auth
  ): Promise<PodcastRoomResponseDto> {
    // const userId = req.user.id; // Uncomment when you have auth
    const userId = 'temp-user-id'; // Remove this line when you have auth

    const podcastRoom = await this.podcastRoomsService.update(
      id,
      updatePodcastRoomDto,
      userId,
    );
    return plainToClass(PodcastRoomResponseDto, podcastRoom, {
      excludeExtraneousValues!: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a podcast room' })
  @ApiParam({ name: 'id', description: 'Podcast room ID' })
  @ApiResponse({
    status!: 204,
    description!: 'Podcast room deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the creator' })
  @ApiResponse({ status: 404, description: 'Podcast room not found' })
  // @ApiBearerAuth() // Uncomment when you have auth
  async remove(
    @Param('id') id: string,
    // @Request() req: any, // Uncomment when you have auth
  ): Promise<void> {
    // const userId = req.user.id; // Uncomment when you have auth
    const userId = 'temp-user-id'; // Remove this line when you have auth

    await this.podcastRoomsService.remove(id, userId);
  }

  @Post(':roomId/verify-access')
  @ApiOperation({ summary: 'Verify access to a podcast room' })
  @ApiParam({ name: 'roomId', description: 'Room identifier' })
  @ApiResponse({ status: 200, description: 'Access verification result' })
  // @ApiBearerAuth() // Uncomment when you have auth
  async verifyAccess(
    @Param('roomId') roomId: string,
    // @Request() req: any, // Uncomment when you have auth
  ): Promise<{ hasAccess: boolean }> {
    // const userId = req.user.id; // Uncomment when you have auth
    const userId = 'temp-user-id'; // Remove this line when you have auth

    const hasAccess = await this.podcastRoomsService.verifyAccess(
      roomId,
      userId,
    );
    return { hasAccess };
  }
}
