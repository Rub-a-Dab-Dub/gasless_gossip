import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TokenLogsService } from './token-logs.service';
import { GetTokenLogsQueryDto } from './dto/get-token-logs-query.dto';

@Controller('token-logs')
export class TokenLogsController {
  constructor(private readonly tokenLogsService: TokenLogsService) {}

  @Get(':userId')
  async getLogs(
    @Param('userId') userId: string,
    @Query() query: GetTokenLogsQueryDto,
  ) {
    if (query.page && query.page < 1)
      throw new BadRequestException('Page must be >= 1');
    if (query.limit && (query.limit < 1 || query.limit > 100))
      throw new BadRequestException('Limit must be 1-100');
    return this.tokenLogsService.getLogsForUser(userId, query);
  }

  @Get(':userId/summary')
  async getSummary(@Param('userId') userId: string) {
    return this.tokenLogsService.getSummaryForUser(userId);
  }
}
