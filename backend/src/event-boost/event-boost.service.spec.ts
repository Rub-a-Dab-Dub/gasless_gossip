import { Test, TestingModule } from '@nestjs/testing';
import { EventBoostService } from './event-boost.service';

describe('EventBoostService', () => {
  let service: EventBoostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventBoostService],
    }).compile();

    service = module.get<EventBoostService>(EventBoostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
