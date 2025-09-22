import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { EventEmitter2 } from "@nestjs/event-emitter"
import type { Visit } from "../entities/visit.entity"
import type { CreateVisitDto } from "../dto/create-visit.dto"
import type { VisitStatsDto } from "../dto/visit-stats.dto"
import { VisitCreatedEvent } from "../events/visit-created.event"
import { Between } from "typeorm"

@Injectable()
export class VisitsService {
  private readonly logger = new Logger(VisitsService.name)

  constructor(
    private readonly visitRepository: Repository<Visit>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createVisit(createVisitDto: CreateVisitDto): Promise<Visit> {
    try {
      // Check for duplicate visits within the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const existingVisit = await this.visitRepository.findOne({
        where!: {
          roomId!: createVisitDto.roomId,
          userId: createVisitDto.userId,
          createdAt: Between(oneHourAgo, new Date()),
        },
      })

      if (existingVisit) {
        // Update duration instead of creating new visit
        existingVisit.duration += createVisitDto.duration || 1
        const updatedVisit = await this.visitRepository.save(existingVisit)

        this.eventEmitter.emit("visit.updated", new VisitCreatedEvent(updatedVisit))
        return updatedVisit
      }

      const visit = this.visitRepository.create(createVisitDto)
      const savedVisit = await this.visitRepository.save(visit)

      // Emit event for analytics and notifications
      this.eventEmitter.emit("visit.created", new VisitCreatedEvent(savedVisit))

      this.logger.log(`Visit created for room ${createVisitDto.roomId} by user ${createVisitDto.userId}`)
      return savedVisit
    } catch (error) {
      this.logger.error(`Failed to create visit: ${error.message}`, error.stack)
      throw new BadRequestException("Failed to create visit")
    }
  }

  async getVisitsByRoom(roomId: string, limit = 50, offset = 0): Promise<Visit[]> {
    return this.visitRepository.find({
      where: { roomId },
      relations: ["user"],
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    })
  }

  async getVisitsByUser(userId: string, limit = 50, offset = 0): Promise<Visit[]> {
    return this.visitRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    })
  }

  async getVisitStats(roomId: string): Promise<VisitStatsDto> {
    const [totalVisits, uniqueVisitors, avgDuration, lastVisit, dailyVisits, peakHour] = await Promise.all([
      this.getTotalVisits(roomId),
      this.getUniqueVisitors(roomId),
      this.getAverageDuration(roomId),
      this.getLastVisit(roomId),
      this.getDailyVisits(roomId),
      this.getPeakHour(roomId),
    ])

    return {
      roomId,
      totalVisits,
      uniqueVisitors,
      averageDuration: Math.round(avgDuration),
      lastVisit,
      dailyVisits,
      peakHour,
    }
  }

  private async getTotalVisits(roomId: string): Promise<number> {
    return this.visitRepository.count({ where: { roomId } })
  }

  private async getUniqueVisitors(roomId: string): Promise<number> {
    const result = await this.visitRepository
      .createQueryBuilder("visit")
      .select("COUNT(DISTINCT visit.userId)", "count")
      .where("visit.roomId = :roomId", { roomId })
      .getRawOne()

    return Number.parseInt(result.count) || 0
  }

  private async getAverageDuration(roomId: string): Promise<number> {
    const result = await this.visitRepository
      .createQueryBuilder("visit")
      .select("AVG(visit.duration)", "avg")
      .where("visit.roomId = :roomId", { roomId })
      .getRawOne()

    return Number.parseFloat(result.avg) || 0
  }

  private async getLastVisit(roomId: string): Promise<Date> {
    const visit = await this.visitRepository.findOne({
      where: { roomId },
      order: { createdAt: "DESC" },
    })

    return visit?.createdAt || new Date(0)
  }

  private async getDailyVisits(roomId: string): Promise<number[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const result = await this.visitRepository
      .createQueryBuilder("visit")
      .select("DATE(visit.createdAt) as date, COUNT(*) as count")
      .where("visit.roomId = :roomId", { roomId })
      .andWhere("visit.createdAt >= :sevenDaysAgo", { sevenDaysAgo })
      .groupBy("DATE(visit.createdAt)")
      .orderBy("date", "ASC")
      .getRawMany()

    // Fill in missing days with 0
    const dailyVisits = new Array(7).fill(0)
    result.forEach((row) => {
      const dayIndex = Math.floor((new Date(row.date).getTime() - sevenDaysAgo.getTime()) / (24 * 60 * 60 * 1000))
      if (dayIndex >= 0 && dayIndex < 7) {
        dailyVisits[dayIndex] = Number.parseInt(row.count)
      }
    })

    return dailyVisits
  }

  private async getPeakHour(roomId: string): Promise<number> {
    const result = await this.visitRepository
      .createQueryBuilder("visit")
      .select("EXTRACT(HOUR FROM visit.createdAt) as hour, COUNT(*) as count")
      .where("visit.roomId = :roomId", { roomId })
      .groupBy("EXTRACT(HOUR FROM visit.createdAt)")
      .orderBy("count", "DESC")
      .limit(1)
      .getRawOne()

    return Number.parseInt(result?.hour) || 0
  }

  async getPopularRooms(limit = 10): Promise<{ roomId: string; visitCount: number }[]> {
    const result = await this.visitRepository
      .createQueryBuilder("visit")
      .select("visit.roomId, COUNT(*) as visitCount")
      .groupBy("visit.roomId")
      .orderBy("visitCount", "DESC")
      .limit(limit)
      .getRawMany()

    return result.map((row) => ({
      roomId: row.visit_roomId,
      visitCount: Number.parseInt(row.visitCount),
    }))
  }

  async deleteOldVisits(daysOld = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

    const result = await this.visitRepository
      .createQueryBuilder()
      .delete()
      .where("createdAt < :cutoffDate", { cutoffDate })
      .execute()

    this.logger.log(`Deleted ${result.affected} old visits older than ${daysOld} days`)
    return result.affected || 0
  }
}
