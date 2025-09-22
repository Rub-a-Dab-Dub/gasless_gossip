import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GatedRoomsService } from './gated-rooms.service';
import { CreateGatedRoomDto } from './dto/create-gated-room.dto';
import { CheckAccessDto, AccessStatusDto } from './dto/check-access.dto';

@Controller('gated-rooms')
export class GatedRoomsController {
  private readonly logger = new Logger(GatedRoomsController.name);

  constructor(private readonly gatedRoomsService: GatedRoomsService) {}

  @Post()
  async create(@Body() createGatedRoomDto: CreateGatedRoomDto) {
    try {
      this.logger.log(`Creating gated room: ${createGatedRoomDto.roomId}`);
      const gatedRoom =
        await this.gatedRoomsService.createGatedRoom(createGatedRoomDto);
      return {
        success!: true,
        data: gatedRoom,
        message: 'Gated room created successfully',
      };
    } catch (error) {
      this.logger.error(`Error creating gated room: ${error.message}`);
      throw new HttpException(
        {
          success!: false,
          message: 'Failed to create gated room',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const gatedRooms = await this.gatedRoomsService.findAll();
      return {
        success!: true,
        data: gatedRooms,
        count: gatedRooms.length,
      };
    } catch (error) {
      this.logger.error(`Error fetching gated rooms: ${error.message}`);
      throw new HttpException(
        {
          success!: false,
          message: 'Failed to fetch gated rooms',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('check')
  async checkAccess(
    @Query() checkAccessDto: CheckAccessDto,
  ): Promise<AccessStatusDto> {
    try {
      this.logger.log(
        `Checking access for room ${checkAccessDto.roomId} and account ${checkAccessDto.stellarAccountId}`,
      );

      const accessStatus =
        await this.gatedRoomsService.checkAccess(checkAccessDto);

      this.logger.log(
        `Access check result: ${accessStatus.hasAccess ? 'GRANTED' : 'DENIED'}`,
      );

      return accessStatus;
    } catch (error) {
      this.logger.error(`Error checking access: ${error.message}`);
      throw new HttpException(
        {
          success!: false,
          message: 'Failed to check room access',
          error: error.message,
          hasAccess: false,
          roomId: checkAccessDto.roomId,
          stellarAccountId: checkAccessDto.stellarAccountId,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const gatedRoom = await this.gatedRoomsService.findOne(id);
      return {
        success!: true,
        data: gatedRoom,
      };
    } catch (error) {
      this.logger.error(`Error fetching gated room ${id}: ${error.message}`);
      throw new HttpException(
        {
          success!: false,
          message: 'Gated room not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.gatedRoomsService.deleteGatedRoom(id);
      return {
        success!: true,
        message: 'Gated room deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting gated room ${id}: ${error.message}`);
      throw new HttpException(
        {
          success!: false,
          message: 'Failed to delete gated room',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
