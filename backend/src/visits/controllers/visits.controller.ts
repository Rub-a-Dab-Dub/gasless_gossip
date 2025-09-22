import { Controller, Get, Post, Param, Query, ParseIntPipe, DefaultValuePipe, UseGuards, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from "@nestjs/swagger"
import type { Request } from "express"
import type { VisitsService } from "../services/visits.service"
import type { CreateVisitDto } from "../dto/create-visit.dto"
import { VisitResponseDto } from "../dto/visit-response.dto"
import { VisitStatsDto } from "../dto/visit-stats.dto"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"

@ApiTags("visits")
@Controller("visits")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ summary: "Log a room visit" })
  @ApiResponse({
    status: 201,
    description: "Visit logged successfully",
    type: VisitResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid visit data",
  })
  async createVisit(createVisitDto: CreateVisitDto, @Req() request: Request): Promise<VisitResponseDto> {
    // Automatically capture IP and user agent if not provided
    if (!createVisitDto.ipAddress) {
      createVisitDto.ipAddress = request.ip || request.connection.remoteAddress
    }
    if (!createVisitDto.userAgent) {
      createVisitDto.userAgent = request.headers["user-agent"]
    }
    if (!createVisitDto.referrer) {
      createVisitDto.referrer = request.headers.referer
    }

    const visit = await this.visitsService.createVisit(createVisitDto)

    return {
      id: visit.id,
      roomId: visit.roomId,
      userId: visit.userId,
      createdAt: visit.createdAt,
      duration: visit.duration,
      user: visit.user
        ? {
            id: visit.user.id,
            username: visit.user.username,
            pseudonym: visit.user.pseudonym,
          }
        : undefined,
    }
  }

  @Get("room/:roomId")
  @ApiOperation({ summary: "Get visits for a specific room" })
  @ApiResponse({
    status: 200,
    description: "Room visits retrieved successfully",
    type: [VisitResponseDto],
  })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of visits to return" })
  @ApiQuery({ name: "offset", required: false, type: Number, description: "Number of visits to skip" })
  async getVisitsByRoom(
    @Param('roomId') roomId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<VisitResponseDto[]> {
    const visits = await this.visitsService.getVisitsByRoom(roomId, limit, offset)

    return visits.map((visit) => ({
      id: visit.id,
      roomId: visit.roomId,
      userId: visit.userId,
      createdAt: visit.createdAt,
      duration: visit.duration,
      user: visit.user
        ? {
            id: visit.user.id,
            username: visit.user.username,
            pseudonym: visit.user.pseudonym,
          }
        : undefined,
    }))
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Get visits for a specific user" })
  @ApiResponse({
    status: 200,
    description: "User visits retrieved successfully",
    type: [VisitResponseDto],
  })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of visits to return" })
  @ApiQuery({ name: "offset", required: false, type: Number, description: "Number of visits to skip" })
  async getVisitsByUser(
    @Param('userId') userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<VisitResponseDto[]> {
    const visits = await this.visitsService.getVisitsByUser(userId, limit, offset)

    return visits.map((visit) => ({
      id: visit.id,
      roomId: visit.roomId,
      userId: visit.userId,
      createdAt: visit.createdAt,
      duration: visit.duration,
    }))
  }

  @Get('stats/:roomId')
  @ApiOperation({ summary: 'Get visit statistics for a room' })
  @ApiResponse({
    status: 200,
    description: 'Visit statistics retrieved successfully',
    type: VisitStatsDto,
  })
  async getVisitStats(@Param('roomId') roomId: string): Promise<VisitStatsDto> {
    return this.visitsService.getVisitStats(roomId);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get most popular rooms by visit count' })
  @ApiResponse({
    status!: 200,
    description: 'Popular rooms retrieved successfully',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of rooms to return' })
  async getPopularRooms(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ roomId: string; visitCount: number }[]> {
    return this.visitsService.getPopularRooms(limit);
  }
}
