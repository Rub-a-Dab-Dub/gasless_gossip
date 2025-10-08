import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { Quest } from './entities/quest.entity';
import { UserQuestProgress } from './entities/user-quest-progress.entity';
import { QuestAudit } from './entities/quest-audit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quest, UserQuestProgress, QuestAudit]),
    ScheduleModule.forRoot()
  ],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService]
})
export class QuestsModule {}

// ==================== USAGE EXAMPLES ====================

/*
1. CREATE A QUEST (Admin):
POST /quests
{
  "title": "Daily Token Sender",
  "description": "Send 3 tokens to friends",
  "type": "daily",
  "requiredCount": 3,
  "xpReward": 100,
  "tokenReward": 5,
  "frenzyMultiplier": 2.0,
  "enableStreaks": true,
  "streakBonusXp": 10
}

2. USER MAKES PROGRESS:
POST /quests/{questId}/progress
{
  "increment": 1
}

Response when completed:
{
  "progress": { ... },
  "completed": true,
  "rewards": {
    "xp": 120,  // 100 base + 10 streak + 10 bonus (day 2 streak)
    "tokens": 5,
    "streak": 2,
    "multiplier": 1
  }
}

3. ACTIVATE FRENZY (Admin):
POST /quests/{questId}/frenzy
{
  "active": true
}

4. GET QUEST STATS (Admin):
GET /quests/{questId}/stats

Response:
{
  "totalUsers": 1500,
  "completedCount": 1200,
  "completionRate": "80.00",
  "averageProgress": "2.85",
  "streaks": {
    "max": 45,
    "average": "7.20"
  }
}

5. AUDIT TRAIL (Admin):
GET /quests/{questId}/audit?userId={userId}
*/