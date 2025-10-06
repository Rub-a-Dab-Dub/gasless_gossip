import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DegenLeaderboardController } from "./degen-leaderboard.controller"
import { DegenLeaderboardService } from "./degen-leaderboard.service"
import { DegenScore } from "./entities/degen-score.entity"
import { LeaderboardBadge } from "./entities/leaderboard-badge.entity"
import { LeaderboardEvent } from "./entities/leaderboard-event.entity"

@Module({
  imports: [TypeOrmModule.forFeature([DegenScore, LeaderboardBadge, LeaderboardEvent])],
  controllers: [DegenLeaderboardController],
  providers: [DegenLeaderboardService],
  exports: [DegenLeaderboardService],
})
export class DegenLeaderboardModule {}
