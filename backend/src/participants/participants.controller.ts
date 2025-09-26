import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { JoinParticipantDto, LeaveParticipantDto } from './dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post('join')
  async join(@Req() req, @Body() dto: JoinParticipantDto) {
    // Assuming user is authenticated and userId is in req.user.id
    return this.participantsService.join(req.user.id, dto);
  }

  @Get(':roomId')
  async getParticipants(@Param('roomId') roomId: string) {
    return this.participantsService.findByRoom(roomId);
  }

  @Delete('leave')
  async leave(@Req() req, @Body() dto: LeaveParticipantDto) {
    return this.participantsService.leave(req.user.id, dto);
  }
}
