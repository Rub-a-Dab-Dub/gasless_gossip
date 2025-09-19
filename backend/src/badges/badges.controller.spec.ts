import { Test, TestingModule } from '@nestjs/testing';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';

describe('BadgesController', () => {
  let controller: BadgesController;
  let service: BadgesService;

  beforeEach(async () => {
    service = { assignBadge: jest.fn(), getBadgesByUser: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BadgesController],
      providers: [{ provide: BadgesService, useValue: service }],
    }).compile();
    controller = module.get<BadgesController>(BadgesController);
  });

  it('should assign a badge', async () => {
    const dto = { userId: 1, type: 'Lord of the Leaks', metadata: {} };
    (service.assignBadge as jest.Mock).mockResolvedValue(dto);
    const result = await controller.assignBadge(dto);
    expect(result).toEqual(dto);
  });

  it('should get badges for user', async () => {
    (service.getBadgesByUser as jest.Mock).mockResolvedValue([{ id: 1, userId: 1, type: 'Lord of the Leaks', metadata: {} }]);
    const result = await controller.getBadges(1);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Lord of the Leaks');
  });
});
