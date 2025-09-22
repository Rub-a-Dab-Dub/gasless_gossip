import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { HooksService } from '../services/hooks.service';
import { CreateHookDto, StellarEventDto, HookResponseDto } from '../dto/hook.dto';
import { EventType } from '../entities/hook.entity';

@Controller('hooks')
export class HooksController {
  private readonly logger = new Logger(HooksController.name);

  constructor(private readonly hooksService: HooksService) {}

  @Post('stellar')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async processStellarEvent(@Body() stellarEventDto: StellarEventDto): Promise<HookResponseDto> {
    try {
      this.logger.log(`Received Stellar event: ${stellarEventDto.eventType} for transaction ${stellarEventDto.transactionId}`);
      const result = await this.hooksService.processStellarEvent(stellarEventDto);
      this.logger.log(`Successfully processed Stellar event: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process Stellar event: ${error.message}`);
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createHook(@Body() createHookDto: CreateHookDto): Promise<HookResponseDto> {
    try {
      this.logger.log(`Creating hook: ${createHookDto.eventType}`);
      const result = await this.hooksService.createHook(createHookDto);
      this.logger.log(`Successfully created hook: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create hook: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async getHookById(@Param('id') id: string): Promise<HookResponseDto> {
    return await this.hooksService.getHookById(id);
  }

  @Get()
  async getHooks(
    @Query('limit') limit?: string,
    @Query('eventType') eventType?: EventType,
  ): Promise<HookResponseDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    
    if (eventType) {
      return await this.hooksService.getHooksByEventType(eventType, limitNumber);
    }
    
    return await this.hooksService.getRecentHooks(limitNumber);
  }

  @Post('process-unprocessed')
  @HttpCode(HttpStatus.NO_CONTENT)
  async processUnprocessedHooks(): Promise<void> {
    this.logger.log('Manual trigger: Processing unprocessed hooks');
    await this.hooksService.processUnprocessedHooks();
  }

  @Get('stats/overview')
  async getHookStats(): Promise<any> {
    return await this.hooksService.getHookStats();
  }
}