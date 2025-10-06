import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { Quest } from './entities/quest.entity';
import { UserQuestProgress } from './entities/user-quest-progress.entity';
import { QuestCompletionAudit } from './entities/quest-completion-audit.entity';
import { FrenzyEvent } from './entities/frenzy-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quest,
      UserQuestProgress,
      QuestCompletionAudit,
      FrenzyEvent
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService]
})
export class QuestsModule {}
