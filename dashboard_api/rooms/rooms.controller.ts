import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RoomsService } from './services/rooms.service';
import { RoomExportService } from './services/room-export.service';
import { RoomEventsGateway } from './events/room-events.gateway';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { BulkUpdateRoomsDto } from './dto/bulk-update-rooms.dto';
import { ModeratorGuard } from './guards/moderator.guard';
import { Moderator } from '../shared/decorators/roles.decorator';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
@UseGuards(ModeratorGuard)
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly exportService: RoomExportService,
    private readonly eventsGateway: RoomEventsGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  async create(@Body() dto: CreateRoomDto, @Req() req: any) {
    const creatorId = req.user.id;
    return this.roomsService.create(dto, creatorId);
  }

  @Get()
  @ApiOperation({ summary: 'List all rooms with filters' })
  async findAll(@Query() query: QueryRoomsDto, @Req() req: any) {
    const isModerator = req.user.role === 'moderator';
    return this.roomsService.findAll(query, isModerator);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room details' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const isModerator = req.user.role === 'moderator';
    return this.roomsService.findOne(id, isModerator);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update room settings' })
  @Moderator()
  async update(@Param('id') id: string, @Body() dto: UpdateRoomDto, @Req() req: any) {
    return this.roomsService.update(id, dto, req.user.id);
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Bulk update multiple rooms' })
  @Moderator()
  async bulkUpdate(@Body() dto: BulkUpdateRoomsDto) {
    return this.roomsService.bulkUpdate(dto);
  }

  @Delete(':id/soft')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete room (close)' })
  @Moderator()
  async softDelete(@Param('id') id: string) {
    await this.roomsService.softDelete(id);
    await this.eventsGateway.notifyParticipants(id, 'Room has been closed');
  }

  @Delete(':id/hard')
  @HttpCode(204)
  @ApiOperation({ summary: 'Hard delete room with cascade' })
  @Moderator()
  async hardDelete(@Param('id') id: string) {
    await this.eventsGateway.notifyParticipants(id, 'Room will be deleted');
    await this.roomsService.hardDelete(id);
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export participant activity as CSV' })
  @Moderator()
  async exportActivity(@Param('id') id: string, @Res() res: Response) {
    const csv = await this.exportService.exportParticipantActivity(id);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="room-${id}-activity.csv"`);
    res.send(csv);
  }
}