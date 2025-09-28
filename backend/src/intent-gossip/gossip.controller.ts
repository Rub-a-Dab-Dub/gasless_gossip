import { Controller, Post, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { IntentGossipService } from './intent-gossip.service';
import { BroadcastIntentDto } from './dto/broadcast-intent.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/gossip')
@UseGuards(AuthGuard)
export class GossipController {
  private readonly logger = new Logger(GossipController.name);

  constructor(private readonly intentGossipService: IntentGossipService) {}

  @Post('intents')
  async broadcastIntent(
    @Request() req,
    @Body() broadcastIntentDto: BroadcastIntentDto,
  ) {
    const userId = req.user.id;
    this.logger.log(`User ${userId} broadcasting intent of type ${broadcastIntentDto.type}`);
    
    await this.intentGossipService.broadcastIntent(userId, broadcastIntentDto);
    
    return {
      success: true,
      message: 'Intent broadcast successfully',
    };
  }
}