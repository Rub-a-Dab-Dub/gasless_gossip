import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JoinRoomDto, LeaveRoomDto } from './dto/room-membership.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Request() req: any, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto, req.user.id);
  }

  @Post('join')
  async joinRoom(@Request() req: any, @Body() joinRoomDto: JoinRoomDto) {
    return this.roomsService.joinRoom(req.user.id, joinRoomDto.roomId);
  }

  @Post('leave')
  async leaveRoom(@Request() req: any, @Body() leaveRoomDto: LeaveRoomDto) {
    return this.roomsService.leaveRoom(req.user.id, leaveRoomDto.roomId);
  }

  @Get()
  async getAllRooms(@Request() req: any) {
    return this.roomsService.getAllRooms(req.user.id);
  }

  @Get(':roomId/members')
  async getRoomMembers(@Param('roomId') roomId: string) {
    return this.roomsService.getRoomMembers(roomId);
  }

  @Get('my-rooms')
  async getUserRooms(@Request() req: any) {
    return this.roomsService.getUserRooms(req.user.id);
  }
}