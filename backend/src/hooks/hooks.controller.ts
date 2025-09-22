import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { HooksService } from './hooks.service';

@Controller('hooks')
export class HooksController {
  private readonly logger = new Logger(HooksController.name);

  constructor(private readonly hooksService: HooksService) {}

  @Post('stellar')
  async handleStellarEvent(
    @Body() body: { eventType: string; data: unknown },
    @Req() request: Request,
  ) {
    const eventType = body.eventType;
    const data = body.data;

    this.logger.log(`Stellar event received: ${eventType} from ${request.ip}`);

    if (!eventType || !data) {
      this.logger.error('Invalid payload received - missing eventType or data');
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }

    try {
      const hook = await this.hooksService.processStellarEvent(eventType, data);
      this.logger.log(`Successfully processed stellar event: ${eventType}`);
      return { status: 'success', hook };
    } catch (error) {
      this.logger.error(`Failed to process stellar event: ${eventType}`, error);
      throw new HttpException(
        'Failed to process event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
