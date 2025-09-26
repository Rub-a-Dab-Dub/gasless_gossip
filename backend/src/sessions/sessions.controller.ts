import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/auth.guard';
import { SessionDto } from './dto/session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':userId')
  @UseGuards(AuthGuard)
  async findByUserId(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<SessionDto[]> {
    // Ensure user can only view their own sessions
    if (req.user.sub !== userId) {
      throw new ForbiddenException('Unauthorized');
    }
    return this.sessionsService.findByUserId(userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@Param('id') id: string, @Request() req: any): Promise<void> {
    // Find the session to check ownership
    const session = await this.sessionsService.findById(id);
    if (session.userId !== req.user.sub) {
      throw new ForbiddenException('Unauthorized');
    }
    await this.sessionsService.revoke(id);
  }
}