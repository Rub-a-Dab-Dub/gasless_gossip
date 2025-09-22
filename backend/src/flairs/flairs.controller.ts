import { Controller, Post, Get, Body, Param, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { FlairsService } from './flairs.service';
import { CreateFlairDto } from './dto/create-flair.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('flairs')
@UseGuards(AuthGuard)
export class FlairsController {
  constructor(private readonly flairsService: FlairsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFlair(@Request() req: any, @Body() dto: CreateFlairDto) {
    const userId = req.user.id;
    return this.flairsService.addFlairForUser(userId, dto);
  }

  @Get(':userId')
  async getUserFlairs(@Param('userId') userId: string) {
    return this.flairsService.getFlairsForUser(userId);
  }
}


