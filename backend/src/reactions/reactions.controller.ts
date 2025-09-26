import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async addReaction(@Body() dto: CreateReactionDto) {
    // TODO: Enforce message access control
    return this.reactionsService.addReaction(dto);
  }

  @Get(':messageId')
  async getReactions(@Param('messageId') messageId: string) {
    return this.reactionsService.countReactions(messageId);
  }
}
