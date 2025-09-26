import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LeaderboardsService } from '../services/leaderboards.service';

// Event interfaces for type safety
interface XpGainedEvent {
  userId: string;
  xpAmount: number;
  source: string;
  timestamp: Date;
}

interface LevelUpEvent {
  userId: string;
  previousLevel: number;
  newLevel: number;
  totalXp: number;
  badgesUnlocked: string[];
  timestamp: Date;
}

interface TipReceivedEvent {
  userId: string;
  tipAmount: number;
  fromUserId: string;
  timestamp: Date;
}

@Injectable()
export class LeaderboardCacheListener {
  private readonly logger = new Logger(LeaderboardCacheListener.name);

  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @OnEvent('xp.gained')
  async handleXpGained(event: XpGainedEvent) {
    this.logger.debug(`XP gained event received for user ${event.userId}: ${event.xpAmount} XP from ${event.source}`);
    
    try {
      // Invalidate user-specific rank cache
      await this.leaderboardsService.invalidateUserRankCache(event.userId);
      
      // Invalidate leaderboard cache (since rankings may have changed)
      await this.leaderboardsService.invalidateLeaderboardCache();
      
      this.logger.debug(`Cache invalidated for XP gain: user ${event.userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache for XP gain: ${error.message}`, error.stack);
    }
  }

  @OnEvent('level.up')
  async handleLevelUp(event: LevelUpEvent) {
    this.logger.debug(`Level up event received for user ${event.userId}: level ${event.previousLevel} -> ${event.newLevel}`);
    
    try {
      // Invalidate user-specific rank cache
      await this.leaderboardsService.invalidateUserRankCache(event.userId);
      
      // Invalidate leaderboard cache (since rankings may have changed)
      await this.leaderboardsService.invalidateLeaderboardCache();
      
      // Invalidate stats cache (since top level may have changed)
      await this.leaderboardsService.invalidateLeaderboardCache();
      
      this.logger.debug(`Cache invalidated for level up: user ${event.userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache for level up: ${error.message}`, error.stack);
    }
  }

  @OnEvent('tip.received')
  async handleTipReceived(event: TipReceivedEvent) {
    this.logger.debug(`Tip received event for user ${event.userId}: ${event.tipAmount} from ${event.fromUserId}`);
    
    try {
      // Invalidate user-specific rank cache
      await this.leaderboardsService.invalidateUserRankCache(event.userId);
      
      // Invalidate leaderboard cache (since rankings may have changed)
      await this.leaderboardsService.invalidateLeaderboardCache();
      
      this.logger.debug(`Cache invalidated for tip received: user ${event.userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache for tip received: ${error.message}`, error.stack);
    }
  }

  @OnEvent('user.created')
  async handleUserCreated(event: { userId: string; username: string; timestamp: Date }) {
    this.logger.debug(`New user created: ${event.userId}`);
    
    try {
      // Invalidate stats cache (since total user count changed)
      await this.leaderboardsService.invalidateLeaderboardCache();
      
      this.logger.debug(`Cache invalidated for new user: ${event.userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache for new user: ${error.message}`, error.stack);
    }
  }

  @OnEvent('user.deleted')
  async handleUserDeleted(event: { userId: string; timestamp: Date }) {
    this.logger.debug(`User deleted: ${event.userId}`);
    
    try {
      // Invalidate all caches since user removal affects rankings and stats
      await this.leaderboardsService.invalidateLeaderboardCache();
      
      this.logger.debug(`Cache invalidated for user deletion: ${event.userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache for user deletion: ${error.message}`, error.stack);
    }
  }
}
