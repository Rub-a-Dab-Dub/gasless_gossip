import { Controller, Get, Post, Put, Delete } from "@nestjs/common"
import type { PumpRoomService } from "./pump-room.service"
import type { CreatePumpRoomDto } from "./dto/create-pump-room.dto"
import type { CreatePredictionDto } from "./dto/create-prediction.dto"
import type { CreateVoteDto } from "./dto/create-vote.dto"
import type { TallyResultsDto } from "./dto/tally-results.dto"
import type { QueryPumpRoomsDto } from "./dto/query-pump-rooms.dto"
import type { VerifyAlphaDto } from "./dto/verify-alpha.dto"

@Controller("pump-room")
export class PumpRoomController {
  constructor(private readonly pumpRoomService: PumpRoomService) {}

  @Post()
  async startPump(dto: CreatePumpRoomDto) {
    return this.pumpRoomService.startPump(dto)
  }

  @Get()
  async getPumpRooms(query: QueryPumpRoomsDto) {
    return this.pumpRoomService.getPumpRooms(query)
  }

  @Get(":id")
  async getPumpRoom(id: string) {
    return this.pumpRoomService.getPumpRoom(id)
  }

  @Post("predictions")
  async createPrediction(dto: CreatePredictionDto) {
    return this.pumpRoomService.createPrediction(dto)
  }

  @Get(":id/predictions")
  async getPredictions(id: string) {
    return this.pumpRoomService.getPredictions(id)
  }

  @Post("votes")
  async createVote(dto: CreateVoteDto) {
    return this.pumpRoomService.createVote(dto)
  }

  @Get(":id/votes")
  async getVotes(id: string, predictionId?: string) {
    return this.pumpRoomService.getVotes(id, predictionId)
  }

  @Get(":id/leaderboard")
  async getLeaderboard(id: string) {
    return this.pumpRoomService.getLeaderboard(id)
  }

  @Put(":id/tally")
  async tallyResults(id: string, dto: TallyResultsDto) {
    return this.pumpRoomService.tallyResults({ ...dto, pumpRoomId: id })
  }

  @Delete(":id/pause")
  async pausePump(id: string, adminId: string, reason?: string) {
    return this.pumpRoomService.pauseOrIntervene(id, adminId, "pause", reason)
  }

  @Delete(":id/cancel")
  async cancelPump(id: string, adminId: string, reason?: string) {
    return this.pumpRoomService.pauseOrIntervene(id, adminId, "cancel", reason)
  }

  @Put("predictions/:id/verify")
  async verifyAlpha(id: string, dto: VerifyAlphaDto) {
    return this.pumpRoomService.verifyAlpha({ ...dto, predictionId: id })
  }

  @Get(":id/rewards")
  async getRewards(id: string) {
    return this.pumpRoomService.getRewards(id)
  }
}
