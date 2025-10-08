import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { ProgressQuestDto } from './dto/progress-quest.dto';

// Assume you have these guards
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  // ==================== ADMIN ENDPOINTS ====================

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  create(@Body() createQuestDto: CreateQuestDto) {
    return this.questsService.create(createQuestDto);
  }

  @Get()
  findAll() {
    return this.questsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  update(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questsService.update(id, updateQuestDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  remove(@Param('id') id: string) {
    return this.questsService.remove(id);
  }

  @Post(':id/frenzy')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  toggleFrenzy(@Param('id') id: string, @Body('active') active: boolean) {
    return this.questsService.toggleFrenzy(id, active);
  }

  @Get(':id/stats')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  getStats(@Param('id') id: string) {
    return this.questsService.getQuestStats(id);
  }

  @Get(':id/audit')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  getAuditLog(@Param('id') id: string, @Body('userId') userId?: string) {
    return this.questsService.getAuditLog(id, userId);
  }

  // ==================== USER ENDPOINTS ====================

  @Get(':id/progress')
  // @UseGuards(JwtAuthGuard)
  getProgress(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'user-123'; // Replace with actual auth
    return this.questsService.getUserProgress(userId, id);
  }

  @Post(':id/progress')
  // @UseGuards(JwtAuthGuard)
  incrementProgress(
    @Param('id') id: string,
    @Body() progressDto: ProgressQuestDto,
    @Req() req: any
  ) {
    const userId = req.user?.id || 'user-123'; // Replace with actual auth
    const ipAddress = req.ip;
    return this.questsService.incrementProgress(userId, id, progressDto.increment, ipAddress);
  }

  @Get('user/history')
  // @UseGuards(JwtAuthGuard)
  getUserHistory(@Req() req: any) {
    const userId = req.user?.id || 'user-123'; // Replace with actual auth
    return this.questsService.getUserQuestHistory(userId);
  }
}