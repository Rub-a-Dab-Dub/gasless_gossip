import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomTagsService } from './room-tags.service';
import {
  CreateRoomTagDto,
  CreateMultipleRoomTagsDto,
} from './dto/create-room-tag.dto';
import {
  SearchRoomsByTagDto,
  SearchRoomsByMultipleTagsDto,
} from './dto/search-rooms-by-tag.dto';
import { DeleteRoomTagDto } from './dto/delete-room-tag.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('room-tags')
@UseGuards(AuthGuard)
export class RoomTagsController {
  constructor(private readonly roomTagsService: RoomTagsService) {}

  @Post()
  async createRoomTag(
    @Request() req: any,
    @Body() createRoomTagDto: CreateRoomTagDto,
  ) {
    return this.roomTagsService.createRoomTag(createRoomTagDto, req.user.id);
  }

  @Post('bulk')
  async createMultipleRoomTags(
    @Request() req: any,
    @Body() createMultipleTagsDto: CreateMultipleRoomTagsDto,
  ) {
    return this.roomTagsService.createMultipleRoomTags(
      createMultipleTagsDto,
      req.user.id,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoomTag(
    @Request() req: any,
    @Body() deleteRoomTagDto: DeleteRoomTagDto,
  ) {
    return this.roomTagsService.deleteRoomTag(deleteRoomTagDto, req.user.id);
  }

  @Get('room/:roomId')
  async getRoomTags(@Param('roomId') roomId: string) {
    return this.roomTagsService.getRoomTags(roomId);
  }

  @Get('search/:tag')
  async searchRoomsByTag(
    @Param('tag') tag: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.roomTagsService.searchRoomsByTag({
      tag,
      limit,
      offset,
    });
  }

  @Post('search')
  async searchRoomsByMultipleTags(
    @Body() searchDto: SearchRoomsByMultipleTagsDto,
  ) {
    return this.roomTagsService.searchRoomsByMultipleTags(searchDto);
  }

  @Get('popular')
  async getPopularTags(@Query('limit') limit?: number) {
    return this.roomTagsService.getPopularTags(limit);
  }

  @Get()
  async getAllTags() {
    return this.roomTagsService.getAllTags();
  }
}