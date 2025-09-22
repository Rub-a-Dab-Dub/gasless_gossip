import { Injectable, Logger } from '@nestjs/common';
import type { LevelsService } from '../services/levels.service';
import type { CreateLevelDto } from '../dto/create-level.dto';

export interface SampleUser {
  id!: string;
  username!: string;
  email!: string;
  stellarAccountId!: string;
}

export interface XpActivity {
  userId!: string;
  xpAmount!: number;
  source!: string;
  description!: string;
}

@Injectable()
export class SampleDataService {
  private readonly logger = new Logger(SampleDataService.name);

  constructor(private readonly levelsService: LevelsService) {}

  async createSampleUsers(): Promise<SampleUser[]> {
    const sampleUsers: SampleUser[] = [
      {
        id!: '550e8400-e29b-41d4-a716-446655440001',
        username: 'alice_explorer',
        email: 'alice@example.com',
        stellarAccountId:
          'GAALICE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'bob_achiever',
        email: 'bob@example.com',
        stellarAccountId:
          'GABBOB123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890A',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        username: 'charlie_champion',
        email: 'charlie@example.com',
        stellarAccountId: 'GACCHARLIE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        username: 'diana_dynamo',
        email: 'diana@example.com',
        stellarAccountId: 'GADDIANA123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        username: 'eve_expert',
        email: 'eve@example.com',
        stellarAccountId: 'GAEEVE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678',
      },
    ];

    this.logger.log(`Created ${sampleUsers.length} sample users`);
    return sampleUsers;
  }

  async initializeSampleLevels(users: SampleUser[]): Promise<void> {
    this.logger.log('Initializing level records for sample users');

    for (const user of users) {
      try {
        const createLevelDto: CreateLevelDto = {
          userId!: user.id,
          level: 1,
          currentXp: 0,
          totalXp: 0,
        };

        await this.levelsService.createUserLevel(createLevelDto);
        this.logger.log(`Created level record for user ${user.username}`);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already has a level record')
        ) {
          this.logger.log(
            `Level record already exists for user ${user.username}`,
          );
        } else {
          this.logger.error(
            `Failed to create level record for user ${user.username}:`,
            error,
          );
        }
      }
    }
  }

  async generateSampleXpActivities(): Promise<XpActivity[]> {
    const activities: XpActivity[] = [
      // Alice - Moderate progression (Level 3-4)
      {
        userId!: '550e8400-e29b-41d4-a716-446655440001',
        xpAmount: 50,
        source: 'daily_login',
        description: 'Daily login bonus',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        xpAmount: 75,
        source: 'quest_completion',
        description: 'Completed beginner quest',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        xpAmount: 100,
        source: 'achievement',
        description: 'First achievement unlocked',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        xpAmount: 150,
        source: 'quest_completion',
        description: 'Completed intermediate quest',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        xpAmount: 25,
        source: 'daily_login',
        description: 'Daily login streak',
      },

      // Bob - High progression (Level 6-7)
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        xpAmount: 200,
        source: 'quest_completion',
        description: 'Completed advanced quest',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        xpAmount: 300,
        source: 'achievement',
        description: 'Speed runner achievement',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        xpAmount: 150,
        source: 'social_interaction',
        description: 'Helped other users',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        xpAmount: 250,
        source: 'quest_completion',
        description: 'Completed expert quest',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        xpAmount: 400,
        source: 'achievement',
        description: 'Master achievement unlocked',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        xpAmount: 500,
        source: 'special_event',
        description: 'Special event participation',
      },

      // Charlie - Very high progression (Level 10+)
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 1000,
        source: 'achievement',
        description: 'Legendary achievement',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 750,
        source: 'quest_completion',
        description: 'Epic quest completion',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 500,
        source: 'social_interaction',
        description: 'Community leader bonus',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 1200,
        source: 'special_event',
        description: 'Tournament winner',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 800,
        source: 'achievement',
        description: 'Perfect score achievement',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 2000,
        source: 'milestone',
        description: 'Major milestone reached',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440003',
        xpAmount: 1500,
        source: 'quest_completion',
        description: 'Ultimate challenge completed',
      },

      // Diana - Moderate-high progression (Level 5-6)
      {
        userId: '550e8400-e29b-41d4-a716-446655440004',
        xpAmount: 300,
        source: 'quest_completion',
        description: 'Story mode completion',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440004',
        xpAmount: 200,
        source: 'achievement',
        description: 'Collector achievement',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440004',
        xpAmount: 150,
        source: 'daily_login',
        description: 'Weekly login bonus',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440004',
        xpAmount: 400,
        source: 'special_event',
        description: 'Seasonal event',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440004',
        xpAmount: 250,
        source: 'social_interaction',
        description: 'Mentorship bonus',
      },

      // Eve - Low-moderate progression (Level 2-3)
      {
        userId: '550e8400-e29b-41d4-a716-446655440005',
        xpAmount: 75,
        source: 'daily_login',
        description: 'First week bonus',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440005',
        xpAmount: 100,
        source: 'quest_completion',
        description: 'Tutorial completion',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440005',
        xpAmount: 50,
        source: 'achievement',
        description: 'First steps achievement',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440005',
        xpAmount: 125,
        source: 'quest_completion',
        description: 'First real quest',
      },
    ];

    this.logger.log(`Generated ${activities.length} sample XP activities`);
    return activities;
  }

  async applySampleXpActivities(activities: XpActivity[]): Promise<void> {
    this.logger.log('Applying sample XP activities to users');

    for (const activity of activities) {
      try {
        const result = await this.levelsService.addXpToUser(
          activity.userId,
          activity.xpAmount,
        );

        this.logger.log(
          `Applied ${activity.xpAmount} XP to user ${activity.userId} from ${activity.source}. ` +
            `New level: ${result.level}, Total XP: ${result.totalXp}`,
        );

        // Add a small delay to simulate real-world timing
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        this.logger.error(
          `Failed to apply XP activity for user ${activity.userId}:`,
          error,
        );
      }
    }
  }

  async runFullSampleDataGeneration(): Promise<void> {
    this.logger.log('Starting full sample data generation');

    try {
      // Step 1: Create sample users
      const users = await this.createSampleUsers();

      // Step 2: Initialize level records
      await this.initializeSampleLevels(users);

      // Step 3: Generate and apply XP activities
      const activities = await this.generateSampleXpActivities();
      await this.applySampleXpActivities(activities);

      // Step 4: Display final results
      await this.displaySampleResults(users);

      this.logger.log('Sample data generation completed successfully');
    } catch (error) {
      this.logger.error('Failed to generate sample data:', error);
      throw error;
    }
  }

  private async displaySampleResults(users: SampleUser[]): Promise<void> {
    this.logger.log('=== SAMPLE DATA RESULTS ===');

    for (const user of users) {
      try {
        const levelData = await this.levelsService.getUserLevel(user.id);
        const rank = await this.levelsService.getUserRank(user.id);

        this.logger.log(
          `${user.username}: Level ${levelData.level}, ` +
            `${levelData.totalXp} total XP, ` +
            `${levelData.progressPercentage}% to next level, ` +
            `Rank #${rank}` +
            `${levelData.isLevelUpPending ? ' [LEVEL UP PENDING]' : ''}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to get results for user ${user.username}:`,
          error,
        );
      }
    }

    // Display leaderboard
    try {
      const leaderboard = await this.levelsService.getLeaderboard(5);
      this.logger.log('=== TOP 5 LEADERBOARD ===');

      leaderboard.forEach((entry, index) => {
        const user = users.find((u) => u.id === entry.userId);
        this.logger.log(
          `#${index + 1}: ${user?.username || 'Unknown'} - ` +
            `Level ${entry.level}, ${entry.totalXp} XP`,
        );
      });
    } catch (error) {
      this.logger.error('Failed to get leaderboard:', error);
    }
  }

  async resetSampleData(): Promise<void> {
    this.logger.log(
      'Resetting sample data (this would clear all level records in a real implementation)',
    );
    // In a real implementation, you would clear the database tables
    // await this.levelRepository.delete({});
  }
}
