import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { RateLimitService } from './services/rate-limit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('rate-limit')
@UseGuards(JwtAuthGuard)
export class RateLimitController {
  constructor(private readonly rateLimitService: RateLimitService) {}

  @Get('violations')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests per minute for admin endpoints
  async getViolations(
    @Query('userId') userId?: string,
    @Query('ipAddress') ipAddress?: string,
    @Query('endpoint') endpoint?: string,
    @Query('hours', new ParseIntPipe({ optional: true })) hours?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    if (userId) {
      return this.rateLimitService.getViolationsByUser(userId, limit || 50);
    }
    
    if (ipAddress) {
      return this.rateLimitService.getViolationsByIp(ipAddress, limit || 50);
    }
    
    if (endpoint) {
      return this.rateLimitService.getViolationsByEndpoint(endpoint, limit || 50);
    }
    
    return this.rateLimitService.getRecentViolations(hours || 24, limit || 100);
  }

  @Get('stats')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute for stats
  async getStats(
    @Query('hours', new ParseIntPipe({ optional: true })) hours?: number,
  ) {
    return this.rateLimitService.getViolationStats(hours || 24);
  }

  @Get('performance')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async getPerformanceMetrics() {
    return this.rateLimitService.getPerformanceMetrics();
  }

  @Post('violations/:id/resolve')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async resolveViolation(@Param('id') violationId: string) {
    await this.rateLimitService.resolveViolation(violationId);
    return { status: 'resolved', violationId };
  }

  @Post('violations/:id/ignore')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async ignoreViolation(@Param('id') violationId: string) {
    await this.rateLimitService.ignoreViolation(violationId);
    return { status: 'ignored', violationId };
  }

  @Post('cleanup')
  @Throttle({ short: { limit: 2, ttl: 60000 } }) // 2 cleanup requests per minute
  async cleanupOldViolations(
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    const deletedCount = await this.rateLimitService.cleanupOldViolations(days || 30);
    return { status: 'cleaned', deletedCount };
  }

  @Get('my-violations')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async getMyViolations(
    @Request() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.rateLimitService.getViolationsByUser(req.user.id, limit || 20);
  }
}
