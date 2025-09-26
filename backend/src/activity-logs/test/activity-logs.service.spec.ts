import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { ActivityLogsService } from "../services/activity-logs.service"
import { ActivityLog, ActivityAction } from "../entities/activity-log.entity"
import { jest } from "@jest/globals" // Import jest to fix the undeclared variable error

describe("ActivityLogsService", () => {
  let service: ActivityLogsService
  let repository: Repository<ActivityLog>
  let eventEmitter: EventEmitter2

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  }

  const mockEventEmitter = {
    emit: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        {
          provide: getRepositoryToken(ActivityLog),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile()

    service = module.get<ActivityLogsService>(ActivityLogsService)
    repository = module.get<Repository<ActivityLog>>(getRepositoryToken(ActivityLog))
    eventEmitter = module.get<EventEmitter2>(EventEmitter2)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("logActivity", () => {
    it("should create and save an activity log", async () => {
      const createDto = {
        userId: "user-123",
        action: ActivityAction.MESSAGE_SENT,
        metadata: { messageId: "msg-123" },
      }

      const savedLog = {
        id: "log-123",
        ...createDto,
        createdAt: new Date(),
      }

      mockRepository.create.mockReturnValue(savedLog)
      mockRepository.save.mockResolvedValue(savedLog)

      const result = await service.logActivity(createDto)

      expect(mockRepository.create).toHaveBeenCalledWith(createDto)
      expect(mockRepository.save).toHaveBeenCalledWith(savedLog)
      expect(mockEventEmitter.emit).toHaveBeenCalledWith("activity.logged", expect.any(Object))
      expect(result).toEqual(savedLog)
    })
  })

  describe("getUserActivities", () => {
    it("should return paginated user activities", async () => {
      const userId = "user-123"
      const queryDto = { page: 1, limit: 20 }
      const activities = [
        { id: "log-1", userId, action: ActivityAction.MESSAGE_SENT },
        { id: "log-2", userId, action: ActivityAction.TIP_SENT },
      ]

      mockRepository.findAndCount.mockResolvedValue([activities, 2])

      const result = await service.getUserActivities(userId, queryDto)

      expect(result).toEqual({
        activities,
        total: 2,
        page: 1,
        limit: 20,
      })
    })
  })

  describe("getUserActivityStats", () => {
    it("should return user activity statistics", async () => {
      const userId = "user-123"

      mockRepository.count.mockResolvedValue(100)
      mockRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { action: ActivityAction.MESSAGE_SENT, count: "50" },
          { action: ActivityAction.TIP_SENT, count: "30" },
        ]),
        getRawOne: jest.fn().mockResolvedValue({ date: "2023-01-01", count: "10" }),
      })

      mockRepository.findOne.mockResolvedValue({
        createdAt: new Date("2023-01-01"),
      })

      const result = await service.getUserActivityStats(userId)

      expect(result).toHaveProperty("totalActivities")
      expect(result).toHaveProperty("actionCounts")
      expect(result).toHaveProperty("last24Hours")
      expect(result).toHaveProperty("mostCommonAction")
    })
  })
})
