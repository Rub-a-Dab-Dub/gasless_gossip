import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionFilter } from './session.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin/sessions')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getSessions(@Query() filter: SessionFilter) {
    return this.sessionService.getSessions(filter);
  }

  @Get('stats')
  async getStats() {
    return this.sessionService.getStats();
  }

  @Delete(':sessionId')
  async terminateSession(@Param('sessionId') sessionId: string) {
    return this.sessionService.terminateSession(sessionId);
  }

  @Post('terminate-all')
  async terminateAllSessions() {
    return this.sessionService.terminateAllSessions();
  }
}