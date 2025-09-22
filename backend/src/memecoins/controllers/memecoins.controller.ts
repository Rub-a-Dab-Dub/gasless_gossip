import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MemecoinsService } from '../services/memecoins.service';
import { CreateDropDto } from '../dto/create-drop.dto';
import { GetUserDropsDto } from '../dto/user-drops.dto';
import { DropHistoryDto } from '../dto/drop-history.dto';

@ApiTags('memecoins')
@Controller('memecoins')
export class MemecoinsController {
  constructor(private readonly memecoinsService: MemecoinsService) {}

  @Post('drop')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new memecoin drop' })
  @ApiResponse({
    status: 201,
    description: 'Drop created and distributed successfully',
    type: DropHistoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed or distribution error',
  })
  async createDrop(
    @Body(ValidationPipe) createDropDto: CreateDropDto,
  ): Promise<DropHistoryDto> {
    return await this.memecoinsService.createDrop(createDropDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get memecoin drop history for a user' })
  @ApiParam({ name: 'userId', description: 'User wallet address or ID' })
  @ApiResponse({
    status: 200,
    description: 'User drop history retrieved successfully',
  })
  async getUserDrops(
    @Param('userId') userId: string,
    @Query(ValidationPipe) query: GetUserDropsDto,
  ) {
    return await this.memecoinsService.getUserDrops(
      userId,
      query.page,
      query.limit,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all memecoin drops with pagination' })
  @ApiResponse({
    status: 200,
    description: 'All drops retrieved successfully',
  })
  async getAllDrops(@Query(ValidationPipe) query: GetUserDropsDto) {
    return await this.memecoinsService.getAllDrops(query.page, query.limit);
  }

  @Get('drop/:id')
  @ApiOperation({ summary: 'Get a specific drop by ID' })
  @ApiParam({ name: 'id', description: 'Drop ID' })
  @ApiResponse({
    status: 200,
    description: 'Drop retrieved successfully',
    type: DropHistoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Drop not found',
  })
  async getDropById(@Param('id') id: string): Promise<DropHistoryDto> {
    return await this.memecoinsService.getDropById(id);
  }

  @Post('drop/:id/retry')
  @ApiOperation({ summary: 'Retry a failed drop' })
  @ApiParam({ name: 'id', description: 'Drop ID' })
  @ApiResponse({
    status: 200,
    description: 'Drop retried successfully',
    type: DropHistoryDto,
  })
  async retryDrop(@Param('id') id: string): Promise<DropHistoryDto> {
    return await this.memecoinsService.retryFailedDrop(id);
  }
}
