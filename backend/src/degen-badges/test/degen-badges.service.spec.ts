import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { ConflictException } from "@nestjs/common"
import { DegenBadgesService } from "../services/degen-badges.service"
import { StellarBadgeService } from "../services/stellar-badge.service"
import { DegenBadge, DegenBadgeType, DegenBadgeRarity } from "../entities/degen-badge.entity"
import { jest } from "@jest/globals" // Import jest to declare it

describe("DegenBadgesService", () => {
  let service: DegenBadgesService
  let repository: Repository<DegenBadge>
  let stellarService: StellarBadgeService
  let eventEmitter: EventEmitter2

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }

  const mockStellarService = {
    mintBadgeToken: jest.fn(),
  }

  const mockEventEmitter = {
    emit: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DegenBadgesService,
        {
          provide: getRepositoryToken(DegenBadge),
          useValue: mockRepository,
        },
        {
          provide: StellarBadgeService,
          useValue: mockStellarService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile()

    service = module.get<DegenBadgesService>(DegenBadgesService)
    repository = module.get<Repository<DegenBadge>>(getRepositoryToken(DegenBadge))
    stellarService = module.get<StellarBadgeService>(StellarBadgeService)
    eventEmitter = module.get<EventEmitter2>(EventEmitter2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("awardBadge", () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000"
    const badgeType = DegenBadgeType.HIGH_ROLLER

    it("should award a new badge successfully", async () => {
      const awardBadgeDto = {
        userId,
        badgeType,
        mintToken: true,
      }

      const mockBadge = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        userId,
        badgeType,
        rarity: DegenBadgeRarity.RARE,
        criteria: { minAmount: 10000 },
        rewardAmount: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const stellarResult = {
        transactionId: "stellar-tx-123",
        assetCode: "DGNHR",
        assetIssuer: "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      }

      mockRepository.findOne.mockResolvedValue(null)
      mockRepository.create.mockReturnValue(mockBadge)
      mockRepository.save.mockResolvedValue(mockBadge)
      mockStellarService.mintBadgeToken.mockResolvedValue(stellarResult)

      const result = await service.awardBadge(awardBadgeDto)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId, badgeType, isActive: true },
      })
      expect(mockRepository.create).toHaveBeenCalled()
      expect(mockRepository.save).toHaveBeenCalledTimes(2) // Once for initial save, once for Stellar update
      expect(mockStellarService.mintBadgeToken).toHaveBeenCalledWith(userId, badgeType, 100)
      expect(mockEventEmitter.emit).toHaveBeenCalledWith("badge.awarded", expect.any(Object))
      expect(result.id).toBe(mockBadge.id)
    })

    it("should throw ConflictException if user already has the badge", async () => {
      const awardBadgeDto = {
        userId,
        badgeType,
      }

      const existingBadge = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        userId,
        badgeType,
        isActive: true,
      }

      mockRepository.findOne.mockResolvedValue(existingBadge)

      await expect(service.awardBadge(awardBadgeDto)).rejects.toThrow(ConflictException)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it("should continue badge award even if Stellar minting fails", async () => {
      const awardBadgeDto = {
        userId,
        badgeType,
        mintToken: true,
      }

      const mockBadge = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        userId,
        badgeType,
        rarity: DegenBadgeRarity.RARE,
        criteria: { minAmount: 10000 },
        rewardAmount: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(null)
      mockRepository.create.mockReturnValue(mockBadge)
      mockRepository.save.mockResolvedValue(mockBadge)
      mockStellarService.mintBadgeToken.mockRejectedValue(new Error("Stellar error"))

      const result = await service.awardBadge(awardBadgeDto)

      expect(result.id).toBe(mockBadge.id)
      expect(mockEventEmitter.emit).toHaveBeenCalled()
    })
  })

  describe("getUserBadges", () => {
    it("should return user badges", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"
      const mockBadges = [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          userId,
          badgeType: DegenBadgeType.HIGH_ROLLER,
          rarity: DegenBadgeRarity.RARE,
          criteria: { minAmount: 10000 },
          rewardAmount: 100,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockRepository.find.mockResolvedValue(mockBadges)

      const result = await service.getUserBadges(userId)

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId, isActive: true },
        order: { createdAt: "DESC" },
      })
      expect(result).toHaveLength(1)
      expect(result[0].badgeType).toBe(DegenBadgeType.HIGH_ROLLER)
    })
  })

  describe("checkBadgeEligibility", () => {
    it("should return true for eligible user", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"
      const badgeType = DegenBadgeType.HIGH_ROLLER
      const userActivity = { maxBetAmount: 15000 }

      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.checkBadgeEligibility(userId, badgeType, userActivity)

      expect(result).toBe(true)
    })

    it("should return false if user already has badge", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000"
      const badgeType = DegenBadgeType.HIGH_ROLLER
      const userActivity = { maxBetAmount: 15000 }

      const existingBadge = { id: "123", userId, badgeType, isActive: true }
      mockRepository.findOne.mockResolvedValue(existingBadge)

      const result = await service.checkBadgeEligibility(userId, badgeType, userActivity)

      expect(result).toBe(false)
    })
  })
})
