import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PollsService } from './services/polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteDto } from './dto/vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomAccessGuard } from '../auth/guards/room-access.guard';
import { RoomAdminGuard } from '../auth/guards/room-admin.guard';

@Controller('polls')
@UseGuards(JwtAuthGuard)
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  @UseGuards(RoomAdminGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Request() req: any, @Body() dto: CreatePollDto) {
    const poll = await this.pollsService.createPoll(dto, req.user.id);
    return poll;
  }

  @Post('vote')
  @UsePipes(new ValidationPipe({ transform: true }))
  async vote(@Request() req: any, @Body() dto: VoteDto) {
    const result = await this.pollsService.vote(dto, req.user.id);
    return result;
  }

  @Get(':roomId')
  @UseGuards(RoomAccessGuard)
  async list(@Request() req: any, @Param('roomId') roomId: string) {
    const polls = await this.pollsService.listPollsForRoom(roomId, req.user.id);
    return polls;
  }
}


