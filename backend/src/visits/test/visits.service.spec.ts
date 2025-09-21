import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { VisitsService } from "../services/visits.service"
import { Visit } from "../entities/visit.entity"
import type { CreateVisitDto } from "../dto/create-visit.dto"
import { jest } from "@jest/globals" // Import jest to declare it

describe("VisitsService", () => {
  let service: VisitsService
  let repository: Repository<Visit>
  let eventEmitter: EventEmitter2

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  }

  const mockEventEmitter = {
    emit: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: getRepositoryToken(Visit),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile()

    service = module.get<VisitsService>(VisitsService)
    repository = module.get<Repository<Visit>>(getRepositoryToken(Visit))
    eventEmitter = module.get<EventEmitter2>(EventEmitter2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("createVisit", () => {
    it("should create a new visit", async () => {
      const createVisitDto: CreateVisitDto = {
        roomId: "room-123",
        userId: "550e8400-e29b-41d4-a716-446655440000",
        duration: 300,
      }

      const mockVisit = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        ...createVisitDto,
        createdAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(null) // No existing visit
      mockRepository.create.mockReturnValue(mockVisit)
      mockRepository.save.mockResolvedValue(mockVisit)

      const result = await service.createVisit(createVisitDto)

      expect(repository.create).toHaveBeenCalledWith(createVisitDto)
      expect(repository.save).toHaveBeenCalledWith(mockVisit)
      expect(eventEmitter.emit).toHaveBeenCalledWith("visit.created", expect.any(Object))
      expect(result).toEqual(mockVisit)
    })

    it("should update existing visit if within one hour", async () => {
      const createVisitDto: CreateVisitDto = {
        roomId: "room-123",
        userId: "550e8400-e29b-41d4-a716-446655440000",
        duration: 300,
      }

      const existingVisit = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        roomId: "room-123",
        userId: "550e8400-e29b-41d4-a716-446655440000",
        duration: 200,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      }

      const updatedVisit = { ...existingVisit, duration: 500 }

      mockRepository.findOne.mockResolvedValue(existingVisit)
      mockRepository.save.mockResolvedValue(updatedVisit)

      const result = await service.createVisit(createVisitDto)

      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ duration: 500 }))
      expect(eventEmitter.emit).toHaveBeenCalledWith("visit.updated", expect.any(Object))
      expect(result.duration).toBe(500)
    })
  })

  describe("getVisitsByRoom", () => {
    it("should return visits for a room", async () => {
      const roomId = "room-123"
      const mockVisits = [
        {
          id: "1",
          roomId,
          userId: "user-1",
          createdAt: new Date(),
          duration: 300,
        },
        {
          id: "2",
          roomId,
          userId: "user-2",
          createdAt: new Date(),
          duration: 450,
        },
      ]

      mockRepository.find.mockResolvedValue(mockVisits)

      const result = await service.getVisitsByRoom(roomId)

      expect(repository.find).toHaveBeenCalledWith({
        where: { roomId },
        relations: ["user"],
        order: { createdAt: "DESC" },
        take: 50,
        skip: 0,
      })
      expect(result).toEqual(mockVisits)
    })
  })

  describe("getVisitStats", () => {
    it("should return visit statistics", async () => {
      const roomId = "room-123"

      // Mock all the private methods
      jest.spyOn(service as any, "getTotalVisits").mockResolvedValue(100)
      jest.spyOn(service as any, "getUniqueVisitors").mockResolvedValue(75)
      jest.spyOn(service as any, "getAverageDuration").mockResolvedValue(245.5)
      jest.spyOn(service as any, "getLastVisit").mockResolvedValue(new Date("2024-01-15T10:30:00Z"))
      jest.spyOn(service as any, "getDailyVisits").mockResolvedValue([12, 15, 8, 22, 18, 25, 20])
      jest.spyOn(service as any, "getPeakHour").mockResolvedValue(14)

      const result = await service.getVisitStats(roomId)

      expect(result).toEqual({
        roomId,
        totalVisits: 100,
        uniqueVisitors: 75,
        averageDuration: 246, // rounded
        lastVisit: new Date("2024-01-15T10:30:00Z"),
        dailyVisits: [12, 15, 8, 22, 18, 25, 20],
        peakHour: 14,
      })
    })
  })
})
