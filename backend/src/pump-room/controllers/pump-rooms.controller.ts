import { Controller, Post, Get, Body, Param, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PumpRoomsService } from '../services/pump-rooms.service';
import { CreatePumpRoomDto } from '../dto/create-pump-room.dto';
import { VoteDto } from '../dto/vote.dto';

@ApiTags('pump-rooms')
@Controller('pump-rooms')
export class PumpRoomsController {
  constructor(private readonly pumpRoomsService: PumpRoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pump room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createRoom(@Body(ValidationPipe) createPumpRoomDto: CreatePumpRoomDto) {
    const room = await this.pumpRoomsService.createRoom(createPumpRoomDto);
    return {
      success: true,
      message: 'Pump room created successfully',
      data: room
    };
  }

  @Post('vote')
  @ApiOperation({ summary: 'Vote on a prediction in a pump room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vote recorded successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid vote data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  async vote(@Body(ValidationPipe) voteDto: VoteDto) {
    const result = await this.pumpRoomsService.vote(voteDto);
    return {
      success: true,
      message: 'Vote recorded successfully',
      data: result
    };
  }

  @Get(':roomId')
  @ApiOperation({ summary: 'Get room details by ID' })
  @ApiParam({ name: 'roomId', description: 'Room identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room details retrieved' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  async getRoom(@Param('roomId') roomId: string) {
    const room = await this.pumpRoomsService.getRoomById(roomId);
    return {
      success: true,
      data: room
    };
  }

  @Get(':roomId/voting-data')
  @ApiOperation({ summary: 'Get voting data and statistics for a room' })
  @ApiParam({ name: 'roomId', description: 'Room identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Voting data retrieved' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  async getVotingData(@Param('roomId') roomId: string) {
    const votingData = await this.pumpRoomsService.getVotingData(roomId);
    return {
      success: true,
      data: votingData
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all active pump rooms' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Active rooms retrieved' })
  async getActiveRooms() {
    const rooms = await this.pumpRoomsService.getAllActiveRooms();
    return {
      success: true,
      data: rooms
    };
  }
}
