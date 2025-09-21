import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import { Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import type { LevelUpEvent } from "../events/level-up.event"
import type { XpGainedEvent } from "../events/xp-gained.event"
import type { BadgeUnlockedEvent } from "../events/badge-unlocked.event"

@WebSocketGateway({
  namespace: "/levels",
  cors: {
    origin: "*",
  },
})
export class LevelsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(LevelsGateway.name)
  private userSockets = new Map<string, string>() // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)

    // Remove user from tracking
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId)
        break
      }
    }
  }

  @SubscribeMessage("join-user-room")
  handleJoinUserRoom(client: Socket, data: { userId: string }) {
    const { userId } = data

    // Join user-specific room
    client.join(`user:${userId}`)

    // Track user socket
    this.userSockets.set(userId, client.id)

    this.logger.log(`User ${userId} joined their room`)

    client.emit("joined-room", { userId, room: `user:${userId}` })
  }

  @OnEvent("level.up")
  handleLevelUpEvent(event: LevelUpEvent) {
    this.logger.log(`Broadcasting level up event for user ${event.userId}`)

    // Send to user's specific room
    this.server.to(`user:${event.userId}`).emit("level-up", {
      userId: event.userId,
      previousLevel: event.previousLevel,
      newLevel: event.newLevel,
      totalXp: event.totalXp,
      badgesUnlocked: event.badgesUnlocked,
      timestamp: new Date(),
    })

    // Also broadcast to general levels room for leaderboard updates
    this.server.to("levels").emit("leaderboard-update", {
      userId: event.userId,
      newLevel: event.newLevel,
      totalXp: event.totalXp,
    })
  }

  @OnEvent("xp.gained")
  handleXpGainedEvent(event: XpGainedEvent) {
    this.logger.log(`Broadcasting XP gained event for user ${event.userId}`)

    this.server.to(`user:${event.userId}`).emit("xp-gained", {
      userId: event.userId,
      xpAmount: event.xpAmount,
      source: event.source,
      metadata: event.metadata,
      timestamp: new Date(),
    })
  }

  @OnEvent("badge.unlocked")
  handleBadgeUnlockedEvent(event: BadgeUnlockedEvent) {
    this.logger.log(`Broadcasting badge unlocked event for user ${event.userId}`)

    this.server.to(`user:${event.userId}`).emit("badge-unlocked", {
      userId: event.userId,
      badgeId: event.badgeId,
      level: event.level,
      stellarTransactionId: event.stellarTransactionId,
      timestamp: new Date(),
    })
  }

  @SubscribeMessage("get-level-status")
  async handleGetLevelStatus(client: Socket, data: { userId: string }) {
    const { userId } = data

    // In a real implementation, you would fetch the current level status
    // from the LevelsService and emit it back to the client

    client.emit("level-status", {
      userId,
      // level data would go here
      timestamp: new Date(),
    })
  }
}
