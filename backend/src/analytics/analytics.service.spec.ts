import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AnalyticsService } from './analytics.service';
import { Analytic, MetricType } from './analytics.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getRawOne: jest.fn()
  }))
};

const mockEventEmitter = {
  emit: jest.fn()
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let repository: Repository<Analytic>;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Analytic),
          useValue: mockRepository
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter
        }
      ]
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    repository = module.get<Repository<Analytic>>(getRepositoryToken(Analytic));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAnalytic', () => {
    it('should create and save an analytic record', async () => {
      const createAnalyticDto = {
        metricType: MetricType.VISIT,
        userId: 'user-123',
        roomId: 'room-456',
        value: 1
      };

      const mockAnalytic = {
        id: 'analytic-789',
        ...createAnalyticDto,
        createdAt: new Date()
      };

      mockRepository.create.mockReturnValue(mockAnalytic);
      mockRepository.save.mockResolvedValue(mockAnalytic);

      const result = await service.createAnalytic(createAnalyticDto);

      expect(repository.create).toHaveBeenCalledWith(createAnalyticDto);
      expect(repository.save).toHaveBeenCalledWith(mockAnalytic);
      expect(eventEmitter.emit).toHaveBeenCalledWith('analytics.created', expect.any(Object));
      expect(result).toEqual(mockAnalytic);
    });
  });

  describe('trackVisit', () => {
    it('should track a visit', async () => {
      const mockAnalytic = {
        id: 'analytic-123',
        metricType: MetricType.VISIT,
        userId: 'user-123',
        roomId: 'room-456',
        value: 1,
        createdAt: new Date()
      };

      mockRepository.create.mockReturnValue(mockAnalytic);
      mockRepository.save.mockResolvedValue(mockAnalytic);

      const result = await service.trackVisit('user-123', 'room-456', { source: 'web' });

      expect(result.metricType).toBe(MetricType.VISIT);
      expect(result.userId).toBe('user-123');
      expect(result.roomId).toBe('room-456');
    });
  });
});

// Sample usage and migration
/*
1. Add to your main app.module.ts:
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // other modules
    AnalyticsModule,
  ],
})
export class AppModule {}

2. Create database migration:
npm run migration:generate -- --name=CreateAnalyticsTable

3. Sample data seeding (analytics.seed.ts):
import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { MetricType } from './analytics.entity';

@Injectable()
export class AnalyticsSeed {
  constructor(private analyticsService: AnalyticsService) {}

  async seedSampleData() {
    const users = ['user-1', 'user-2', 'user-3'];
    const rooms = ['room-a', 'room-b', 'room-c'];
    
    // Create sample visits
    for (let i = 0; i < 50; i++) {
      await this.analyticsService.trackVisit(
        users[Math.floor(Math.random() * users.length)],
        rooms[Math.floor(Math.random() * rooms.length)]
      );
    }
    
    // Create sample tips
    for (let i = 0; i < 20; i++) {
      await this.analyticsService.trackTip(
        users[Math.floor(Math.random() * users.length)],
        Math.random() * 100,
        rooms[Math.floor(Math.random() * rooms.length)]
      );
    }
    
    // Create sample reactions
    for (let i = 0; i < 100; i++) {
      await this.analyticsService.trackReaction(
        users[Math.floor(Math.random() * users.length)],
        rooms[Math.floor(Math.random() * rooms.length)],
        ['like', 'heart', 'fire'][Math.floor(Math.random() * 3)]
      );
    }
  }
}

4. Example API calls:
// Get user analytics with filters
GET /analytics/user-123?metricType=visit&startDate=2024-01-01&groupBy=day

// Get room analytics
GET /analytics/room/room-456?startDate=2024-01-01&endDate=2024-01-31

// Track a visit
POST /analytics/track/visit
{ "userId": "user-123", "roomId": "room-456" }

// Track a tip
POST /analytics/track/tip
{ "userId": "user-123", "amount": 50, "roomId": "room-456" }
*/