import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GiftsGivenService } from './gifts-given.service';
import { CreateGiftLogDto } from './dto/create-gift-log.dto';
import { GiftLogResponseDto } from './dto/gift-log-response.dto';
import { GiftHistoryQueryDto } from './dto/gift-history-query.dto';

@ApiTags('Gift History')
@Controller('gifts-given')
export class GiftsGivenController {
  constructor(private readonly giftsGivenService: GiftsGivenService) {}

  @Post('log')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log a gift that was sent' })
  @ApiResponse({ 
    status: 201, 
    description: 'Gift successfully logged',
    type: GiftLogResponseDto 
  })
  async logGift(@Body() createGiftLogDto: CreateGiftLogDto): Promise<GiftLogResponseDto> {
    return this.giftsGivenService.logGift(createGiftLogDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get gift history for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift history retrieved successfully'
  })
  async getUserGiftHistory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: GiftHistoryQueryDto,
  ) {
    return this.giftsGivenService.getUserGiftHistory(userId, query);
  }

  @Get(':userId/analytics')
  @ApiOperation({ summary: 'Get gift analytics for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Gift analytics retrieved successfully'
  })
  async getGiftAnalytics(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.giftsGivenService.getGiftAnalytics(userId);
  }
}