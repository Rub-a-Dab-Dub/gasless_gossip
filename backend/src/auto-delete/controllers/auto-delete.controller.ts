import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { AutoDeleteService } from '../services/auto-delete.service';
import { SetAutoDeleteDto } from '../dto/set-auto-delete.dto';

@Controller('auto-delete')
export class AutoDeleteController {
  constructor(private readonly service: AutoDeleteService) {}

  @Post('set')
  @UsePipes(new ValidationPipe({ transform: true }))
  async setTimer(@Body() dto: SetAutoDeleteDto) {
    const timer = await this.service.setTimer(dto);
    return { messageId: timer.messageId, expiry: timer.expiry };
  }

  @Get(':messageId')
  async getTimer(@Param('messageId') messageId: string) {
    const timer = await this.service.getTimer(messageId);
    return timer
      ? { messageId: timer.messageId, expiry: timer.expiry }
      : { messageId, expiry: null };
  }
}


