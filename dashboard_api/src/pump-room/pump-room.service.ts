import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import { PumpRoom } from "./entities/pump-room.entity"
import { Prediction } from "./entities/prediction.entity"
import { Vote } from "./entities/vote.entity"
import { PumpReward } from "./entities/pump-reward.entity"
import type { CreatePumpRoomDto } from "./dto/create-pump-room.dto"
import type { CreatePredictionDto } from "./dto/create-prediction.dto"
import type { CreateVoteDto } from "./dto/create-vote.dto"
import type { TallyResultsDto } from "./dto/tally-results.dto"
import type { QueryPumpRoomsDto } from "./dto/query-pump-rooms.dto"
import type { VerifyAlphaDto } from "./dto/verify-alpha.dto"

@Injectable()
export class PumpRoomService {
  private pumpRoomRepo: Repository<PumpRoom>
  private predictionRepo: Repository<Prediction>
  private voteRepo: Repository<Vote>
  private rewardRepo: Repository<PumpReward>
  private redisClient: any

  constructor(repoFactory: any, redisClient?: any) {
    this.pumpRoomRepo = repoFactory.getRepository(PumpRoom)
    this.predictionRepo = repoFactory.getRepository(Prediction)
    this.voteRepo = repoFactory.getRepository(Vote)
    this.rewardRepo = repoFactory.getRepository(PumpReward)
    this.redisClient = redisClient
  }

  async startPump(dto: CreatePumpRoomDto): Promise<PumpRoom> {
    const pumpRoom = this.pumpRoomRepo.create({
      roomName: dto.roomName,
      description: dto.description,
      creatorId: dto.creatorId,
      status: "active",
      startTime: dto.startTime,
      endTime: dto.endTime,
      totalPredictions: 0,
      totalVotes: 0,
      totalParticipants: 0,
      verificationRequired: dto.verificationRequired || false,
      minAlphaScore: dto.minAlphaScore,
      rewardPool: dto.rewardPool || 0,
      rewardDistributed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return this.pumpRoomRepo.save(pumpRoom)
  }

  async createPrediction(dto: CreatePredictionDto): Promise<Prediction> {
    // Check if room is active
    const room = await this.pumpRoomRepo.findOne({ where: { id: dto.pumpRoomId } })
    if (!room || room.status !== "active") {
      throw new Error("Pump room is not active")
    }

    // Check alpha score requirement
    if (room.minAlphaScore && dto.alphaScore < room.minAlphaScore) {
      throw new Error(`Minimum alpha score of ${room.minAlphaScore} required`)
    }

    const prediction = this.predictionRepo.create({
      pumpRoomId: dto.pumpRoomId,
      userId: dto.userId,
      username: dto.username,
      predictionText: dto.predictionText,
      targetPrice: dto.targetPrice,
      targetDate: dto.targetDate,
      confidence: dto.confidence,
      alphaScore: dto.alphaScore,
      isVerified: !room.verificationRequired,
      totalVotes: 0,
      weightedVoteScore: 0,
      outcome: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const saved = await this.predictionRepo.save(prediction)

    // Update room stats
    await this.pumpRoomRepo.update(
      { id: dto.pumpRoomId },
      {
        totalPredictions: room.totalPredictions + 1,
        totalParticipants: room.totalParticipants + 1,
        updatedAt: new Date(),
      },
    )

    // Invalidate cache
    await this.invalidateCache(dto.pumpRoomId)

    return saved
  }

  async createVote(dto: CreateVoteDto): Promise<Vote> {
    // Check if prediction exists
    const prediction = await this.predictionRepo.findOne({ where: { id: dto.predictionId } })
    if (!prediction) {
      throw new Error("Prediction not found")
    }

    // Check if user already voted
    const existingVote = await this.voteRepo.findOne({
      where: { predictionId: dto.predictionId, userId: dto.userId },
    })
    if (existingVote) {
      throw new Error("User has already voted on this prediction")
    }

    // Calculate vote weight based on alpha score and stake
    const weight = this.calculateVoteWeight(dto.alphaScore, dto.stakeAmount)

    const vote = this.voteRepo.create({
      pumpRoomId: dto.pumpRoomId,
      predictionId: dto.predictionId,
      userId: dto.userId,
      username: dto.username,
      voteType: dto.voteType,
      weight,
      alphaScore: dto.alphaScore,
      stakeAmount: dto.stakeAmount,
      createdAt: new Date(),
    })

    const saved = await this.voteRepo.save(vote)

    // Update prediction vote counts
    const voteMultiplier = dto.voteType === "upvote" ? 1 : -1
    await this.predictionRepo.update(
      { id: dto.predictionId },
      {
        totalVotes: prediction.totalVotes + 1,
        weightedVoteScore: prediction.weightedVoteScore + weight * voteMultiplier,
        updatedAt: new Date(),
      },
    )

    // Update room stats
    const room = await this.pumpRoomRepo.findOne({ where: { id: dto.pumpRoomId } })
    if (room) {
      await this.pumpRoomRepo.update(
        { id: dto.pumpRoomId },
        {
          totalVotes: room.totalVotes + 1,
          updatedAt: new Date(),
        },
      )
    }

    // Invalidate cache
    await this.invalidateCache(dto.pumpRoomId)

    return saved
  }

  async getVotes(pumpRoomId: string, predictionId?: string): Promise<Vote[]> {
    const where: any = { pumpRoomId }
    if (predictionId) where.predictionId = predictionId

    return this.voteRepo.find({
      where,
      order: { createdAt: "DESC" },
    })
  }

  async tallyResults(dto: TallyResultsDto): Promise<{ updated: number; rewardsDistributed: number }> {
    const room = await this.pumpRoomRepo.findOne({ where: { id: dto.pumpRoomId } })
    if (!room) {
      throw new Error("Pump room not found")
    }

    let updated = 0
    const rewardDistribution: Array<{ userId: string; amount: number; rank: number }> = []

    // Update prediction outcomes
    for (const outcome of dto.outcomes) {
      const prediction = await this.predictionRepo.findOne({ where: { id: outcome.predictionId } })
      if (prediction) {
        await this.predictionRepo.update(
          { id: outcome.predictionId },
          { outcome: outcome.outcome, updatedAt: new Date() },
        )
        updated++
      }
    }

    // Calculate rewards for correct predictions
    const correctPredictions = await this.predictionRepo.find({
      where: { pumpRoomId: dto.pumpRoomId, outcome: "correct" },
      order: { weightedVoteScore: "DESC" },
    })

    if (correctPredictions.length > 0 && room.rewardPool > 0) {
      const totalScore = correctPredictions.reduce((sum, p) => sum + p.weightedVoteScore, 0)

      for (let i = 0; i < correctPredictions.length; i++) {
        const prediction = correctPredictions[i]
        const rewardShare = totalScore > 0 ? (prediction.weightedVoteScore / totalScore) * room.rewardPool : 0

        // Apply rank bonus
        let rankMultiplier = 1
        if (i === 0)
          rankMultiplier = 1.5 // 1st place gets 50% bonus
        else if (i === 1)
          rankMultiplier = 1.25 // 2nd place gets 25% bonus
        else if (i === 2) rankMultiplier = 1.1 // 3rd place gets 10% bonus

        const finalReward = rewardShare * rankMultiplier

        await this.predictionRepo.update({ id: prediction.id }, { rewardAmount: finalReward })

        rewardDistribution.push({
          userId: prediction.userId,
          amount: finalReward,
          rank: i + 1,
        })
      }
    }

    // Distribute rewards
    let rewardsDistributed = 0
    for (const reward of rewardDistribution) {
      const pumpReward = this.rewardRepo.create({
        pumpRoomId: dto.pumpRoomId,
        userId: reward.userId,
        username: "", // Will be filled from prediction
        rewardType: "prediction_winner",
        amount: reward.amount,
        rank: reward.rank,
        distributedAt: new Date(),
        status: "completed",
      })
      await this.rewardRepo.save(pumpReward)
      rewardsDistributed++
    }

    // Update room status
    await this.pumpRoomRepo.update(
      { id: dto.pumpRoomId },
      {
        status: "completed",
        rewardDistributed: true,
        updatedAt: new Date(),
      },
    )

    // Invalidate cache
    await this.invalidateCache(dto.pumpRoomId)

    return { updated, rewardsDistributed }
  }

  async pauseOrIntervene(
    pumpRoomId: string,
    adminId: string,
    action: "pause" | "cancel",
    reason?: string,
  ): Promise<PumpRoom> {
    const room = await this.pumpRoomRepo.findOne({ where: { id: pumpRoomId } })
    if (!room) {
      throw new Error("Pump room not found")
    }

    const newStatus = action === "pause" ? "paused" : "cancelled"

    await this.pumpRoomRepo.update(
      { id: pumpRoomId },
      {
        status: newStatus,
        updatedAt: new Date(),
      },
    )

    // Invalidate cache
    await this.invalidateCache(pumpRoomId)

    const updated = await this.pumpRoomRepo.findOne({ where: { id: pumpRoomId } })
    return updated!
  }

  async verifyAlpha(dto: VerifyAlphaDto): Promise<Prediction> {
    const prediction = await this.predictionRepo.findOne({ where: { id: dto.predictionId } })
    if (!prediction) {
      throw new Error("Prediction not found")
    }

    await this.predictionRepo.update(
      { id: dto.predictionId },
      {
        isVerified: dto.isVerified,
        verifiedAt: new Date(),
        verifiedBy: dto.verifiedBy,
        updatedAt: new Date(),
      },
    )

    // Invalidate cache
    await this.invalidateCache(prediction.pumpRoomId)

    const updated = await this.predictionRepo.findOne({ where: { id: dto.predictionId } })
    return updated!
  }

  async getLeaderboard(pumpRoomId: string): Promise<Prediction[]> {
    // Try cache first
    const cacheKey = `pump_leaderboard:${pumpRoomId}`
    if (this.redisClient) {
      const cached = await this.redisClient.get(cacheKey)
      if (cached) return JSON.parse(cached)
    }

    const leaderboard = await this.predictionRepo.find({
      where: { pumpRoomId, isVerified: true },
      order: { weightedVoteScore: "DESC" },
      take: 100,
    })

    // Cache for 5 seconds for real-time updates
    if (this.redisClient) {
      await this.redisClient.setex(cacheKey, 5, JSON.stringify(leaderboard))
    }

    return leaderboard
  }

  async getPumpRooms(query: QueryPumpRoomsDto): Promise<PumpRoom[]> {
    const { status, creatorId, limit = 50, offset = 0 } = query

    const where: any = {}
    if (status) where.status = status
    if (creatorId) where.creatorId = creatorId

    return this.pumpRoomRepo.find({
      where,
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    })
  }

  async getPumpRoom(pumpRoomId: string): Promise<PumpRoom | null> {
    return this.pumpRoomRepo.findOne({ where: { id: pumpRoomId } })
  }

  async getPredictions(pumpRoomId: string): Promise<Prediction[]> {
    return this.predictionRepo.find({
      where: { pumpRoomId },
      order: { weightedVoteScore: "DESC" },
    })
  }

  async getRewards(pumpRoomId: string): Promise<PumpReward[]> {
    return this.rewardRepo.find({
      where: { pumpRoomId },
      order: { rank: "ASC" },
    })
  }

  private calculateVoteWeight(alphaScore: number, stakeAmount?: number): number {
    // Base weight from alpha score (0-100 scale)
    const alphaWeight = alphaScore / 100

    // Additional weight from stake (logarithmic scale)
    const stakeWeight = stakeAmount ? Math.log10(stakeAmount + 1) / 10 : 0

    // Combined weight (alpha is 70%, stake is 30%)
    return alphaWeight * 0.7 + stakeWeight * 0.3
  }

  private async invalidateCache(pumpRoomId: string): Promise<void> {
    if (!this.redisClient) return

    const keys = [`pump_leaderboard:${pumpRoomId}`]
    await this.redisClient.del(...keys)
  }
}
