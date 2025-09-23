import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FanGiftingService } from '../services/fan-gifting.service';
import { CreateFanGiftDto } from '../dto/create-fan-gift.dto';
import { GiftHistoryQueryDto } from '../dto/gift-history-query.dto';
import { FanGiftResponseDto } from '../dto/fan-gift-response.dto';
// Assuming you have auth guards
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Fan Gifting')
@Controller('fan-gifts')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class FanGiftingController {
  constructor(private readonly fanGiftingService: FanGiftingService) {}

  @Post()
  @ApiOperation({ summary: 'Send a gift to a creator' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Gift sent successfully',
    type: FanGiftResponseDto 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid gift data' })
  async createGift(
    @Body() createGiftDto: CreateFanGiftDto,
    @Request() req: any // In real app, this would be typed based on your auth
  ): Promise<FanGiftResponseDto> {
    // In a real app, you'd get the user ID from the JWT token
    const fanId = req.user?.id || 'mock-fan-id';
    
    return await this.fanGiftingService.createGift(fanId, createGiftDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get gift history for a user' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Gift history retrieved successfully' 
  })
  async getGiftHistory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: GiftHistoryQueryDto
  ) {
    return await this.fanGiftingService.getGiftHistory(userId, query);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get gift statistics for a user' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Gift statistics retrieved successfully' 
  })
  async getGiftStats(
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    return await this.fanGiftingService.getGiftStats(userId);
  }

  @Get('gift/:giftId')
  @ApiOperation({ summary: 'Get specific gift details' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Gift details retrieved successfully',
    type: FanGiftResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Gift not found' })
  async getGiftById(
    @Param('giftId', ParseUUIDPipe) giftId: string
  ): Promise<FanGiftResponseDto> {
    return await this.fanGiftingService.getGiftById(giftId);
  }
}
