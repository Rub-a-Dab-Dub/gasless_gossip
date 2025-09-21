import { Test, type TestingModule } from "@nestjs/testing"
import type { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { LevelsService } from "../services/levels.service"
import { Level } from "../entities/level.entity"
import { LevelUpEvent } from "../events/level-up.event"
import { jest } from "@jest/globals"

describe("LevelsService", () => {
  let service: LevelsService
  let repository: Repository<Level>
  let eventEmitter: EventEmitter2

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  }

  const mockEventEmitter = {
    emit: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelsService,
        {
          provide: getRepositoryToken(Level),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile()

    service = module.get<LevelsService>(LevelsService)
    repository = module.get<Repository<Level>>(getRepositoryToken(Level))
    eventEmitter = module.get<EventEmitter2>(EventEmitter2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("createUserLevel", () => {
    it("should create a new level record for a user", async () => {
      const createLevelDto = {
        userId: "test-user-id",
        level: 1,
        currentXp: 0,
        totalXp: 0,
      }

      const mockLevel = {
        id: "level-id",
        userId: "test-user-id",
        level: 1,
        currentXp: 0,
        totalXp: 0,
        xpThreshold: 100,
        isLevelUpPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(null)
      mockRepository.create.mockReturnValue(mockLevel)
      mockRepository.save.mockResolvedValue(mockLevel)

      const result = await service.createUserLevel(createLevelDto)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: "test-user-id" },
      })
      expect(mockRepository.create).toHaveBeenCalled()
      expect(mockRepository.save).toHaveBeenCalledWith(mockLevel)
      expect(result.userId).toBe("test-user-id")
      expect(result.level).toBe(1)
    })

    it("should throw error if user already has a level record", async () => {
      const createLevelDto = {
        userId: "test-user-id",
      }

      const existingLevel = { id: "existing-id", userId: "test-user-id" }
      mockRepository.findOne.mockResolvedValue(existingLevel)

      await expect(service.createUserLevel(createLevelDto)).rejects.toThrow("User already has a level record")
    })
  })

  describe("addXpToUser", () => {
    it("should add XP and trigger level up when threshold is reached", async () => {
      const userId = "test-user-id"
      const xpToAdd = 150

      const existingLevel = {
        id: "level-id",
        userId,
        level: 1,
        currentXp: 50,
        totalXp: 50,
        xpThreshold: 100,
        isLevelUpPending: false,
      }

      const updatedLevel = {
        ...existingLevel,
        level: 2,
        currentXp: 100,
        totalXp: 200,
        xpThreshold: 250,
        isLevelUpPending: true,
      }

      mockRepository.findOne.mockResolvedValue(existingLevel)
      mockRepository.save.mockResolvedValue(updatedLevel)

      const result = await service.addXpToUser(userId, xpToAdd)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      })
      expect(mockRepository.save).toHaveBeenCalled()
      expect(mockEventEmitter.emit).toHaveBeenCalledWith("level.up", expect.any(LevelUpEvent))
      expect(result.level).toBe(2)
      expect(result.totalXp).toBe(200)
      expect(result.isLevelUpPending).toBe(true)
    })

    it("should add XP without level up when threshold is not reached", async () => {
      const userId = "test-user-id"
      const xpToAdd = 25

      const existingLevel = {
        id: "level-id",
        userId,
        level: 1,
        currentXp: 50,
        totalXp: 50,
        xpThreshold: 100,
        isLevelUpPending: false,
      }

      const updatedLevel = {
        ...existingLevel,
        currentXp: 75,
        totalXp: 75,
      }

      mockRepository.findOne.mockResolvedValue(existingLevel)
      mockRepository.save.mockResolvedValue(updatedLevel)

      const result = await service.addXpToUser(userId, xpToAdd)

      expect(mockEventEmitter.emit).not.toHaveBeenCalled()
      expect(result.level).toBe(1)
      expect(result.totalXp).toBe(75)
      expect(result.isLevelUpPending).toBe(false)
    })
  })

  describe("getLeaderboard", () => {
    it("should return top users by total XP", async () => {
      const mockLevels = [
        {
          id: "1",
          userId: "user-1",
          level: 5,
          totalXp: 1500,
          currentXp: 500,
          xpThreshold: 1750,
          isLevelUpPending: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          userId: "user-2",
          level: 3,
          totalXp: 800,
          currentXp: 300,
          xpThreshold: 1000,
          isLevelUpPending: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockRepository.find.mockResolvedValue(mockLevels)

      const result = await service.getLeaderboard(10)

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { totalXp: "DESC" },
        take: 10,
      })
      expect(result).toHaveLength(2)
      expect(result[0].userId).toBe("user-1")
      expect(result[0].totalXp).toBe(1500)
    })
  })
})
