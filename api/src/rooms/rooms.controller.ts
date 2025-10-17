import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  UseGuards,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { RoomService } from './rooms.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { AddRoomMemberDto } from './dtos/add-room-member.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  createRoom(@Body() dto: CreateRoomDto, @Request() req) {
    return this.roomService.createRoom(req.user.userId, dto);
  }

  @Put(':roomId')
  updateRoom(
    @Param('roomId') roomId: number,
    @Body() dto: UpdateRoomDto,
    @Request() req,
  ) {
    return this.roomService.updateRoom(roomId, req.user.userId, dto);
  }

  @Delete(':roomId')
  deleteRoom(@Param('roomId') roomId: number, @Request() req) {
    return this.roomService.deleteRoom(roomId, req.user.userId);
  }

  @Get()
  getAllRooms(@Query('categoryId') categoryId: number) {
    return this.roomService.getAllRooms(categoryId);
  }

  @Get('/created')
  getMyCreatedRooms(@Request() req) {
    return this.roomService.getMyCreatedRooms(req.user.userId);
  }

  @Get('/me')
  getMyRooms(@Request() req) {
    return this.roomService.getMyRooms(req.user.userId);
  }

  @Get(':roomId')
  getRoomById(@Param('roomId') roomId: number) {
    return this.roomService.getRoomById(roomId);
  }

  @Get(':roomCode')
  getRoomByCode(@Param('roomCode') roomCode: string) {
    return this.roomService.getRoomByCode(roomCode);
  }

  @Post('add-member')
  addMember(@Body() dto: AddRoomMemberDto) {
    return this.roomService.addMember(dto);
  }

  @Delete(':roomId/remove/:userId')
  removeMember(
    @Param('roomId') roomId: number,
    @Param('userId') userId: number,
  ) {
    return this.roomService.removeMember(roomId, userId);
  }

  @Get(':roomId/members')
  getMembers(@Param('roomId') roomId: number) {
    return this.roomService.getMembers(roomId);
  }
}
