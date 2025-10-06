import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('quests')
@Controller('quests')
@ApiBearerAuth()
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quest (Admin only)' })
  // @UseGuards(AdminGuard) // Add your admin guard
  create(@Body() createQuestDto: CreateQuestDto) {
    return this.questsService.create(createQuestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quests' })
  findAll(@Query('status') status?: QuestStatus) {
    return this.questsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quest by ID' })
  findOne(@Param('id') id: string) {
    return this.questsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quest (Admin only)' })
  // @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questsService.update(id, updateQuestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'End a quest prematurely (Admin only)' })
  // @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.questsService.delete(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get quest completion statistics' })
  getStats(@Param('id') id: string) {
    return this.questsService.getQuestStats(id);
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Increment quest progress for user' })
  incrementProgress(
    @Param('id') questId: string,
    @Body('userId') userId: string,
    @Body('amount') amount: number = 1
  ) {
    return this.questsService.incrementProgress(userId, questId, amount);
  }

  @Get('user/:userId/progress')
  @ApiOperation({ summary: 'Get user progress for all quests' })
  getUserProgress(@Param('userId') userId: string) {
    return this.questsService.getUserStreaks(userId);
  }

  @Get('user/:userId/streaks')
  @ApiOperation({ summary: 'Get user streaks' })
  getUserStreaks(@Param('userId') userId: string) {
    return this.questsService.getUserStreaks(userId);
  }

  @Get('user/:userId/history')
  @ApiOperation({ summary: 'Get user completion history' })
  getHistory(
    @Param('userId') userId: string,
    @Query('questId') questId?: string
  ) {
    return this.questsService.getUserCompletionHistory(userId, questId);
  }

  @Post('frenzy')
  @ApiOperation({ summary: 'Create a frenzy event (Admin only)' })
  // @UseGuards(AdminGuard)
  createFrenzy(@Body() body: {
    name: string;
    description: string;
    multiplier: number;
    startsAt: Date;
    endsAt: Date;
    questIds?: string[];
  }) {
    return this.questsService.createFrenzy(
      body.name,
      body.description,
      body.multiplier,
      body.startsAt,
      body.endsAt,
      body.questIds
    );
  }

  @Get('frenzy/active')
  @ApiOperation({ summary: 'Get active frenzy event' })
  getActiveFrenzy(@Query('questId') questId?: string) {
    return this.questsService.getActiveFrenzy(questId);
  }

  @Post('boost/apply')
  @ApiOperation({ summary: 'Apply boost to user (Admin only)' })
  // @UseGuards(AdminGuard)
  applyBoost(@Body() dto: ApplyFrenzyBoostDto) {
    return this.questsService.applyBoostToUser(dto);
  }

  @Get('audit/duplicates')
  @ApiOperation({ summary: 'Detect multiple completions (Admin only)' })
  // @UseGuards(AdminGuard)
  detectDuplicates() {
    return this.questsService.detectMultipleCompletions();
  }
}