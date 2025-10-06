import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import type { DauMetricsService } from "./dau-metrics.service"
import type { TrackFeatureUsageDto } from "./dto/track-feature-usage.dto"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/dau-metrics",
})
export class DauMetricsGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly dauMetricsService: DauMetricsService) {}

  // Real-time feature usage tracking
  handleTrackUsage(data: TrackFeatureUsageDto, client: Socket) {
    try {
      const usage = this.dauMetricsService.trackFeatureUsage(data)

      // Broadcast to all connected clients
      this.server.emit("usage-tracked", {
        featureName: usage.featureName,
        userId: usage.userId,
        timestamp: usage.usageTimestamp,
      })

      return { success: true, data: usage }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Subscribe to real-time DAU updates
  handleSubscribeDau(data: { featureName?: string }, client: Socket) {
    const room = data.featureName ? `dau-${data.featureName}` : "dau-all"
    client.join(room)
    return { success: true, message: `Subscribed to ${room}` }
  }

  handleUnsubscribeDau(data: { featureName?: string }, client: Socket) {
    const room = data.featureName ? `dau-${data.featureName}` : "dau-all"
    client.leave(room)
    return { success: true, message: `Unsubscribed from ${room}` }
  }

  // Broadcast DAU updates (called by service)
  broadcastDauUpdate(featureName: string, data: any) {
    this.server.to(`dau-${featureName}`).emit("dau-update", data)
    this.server.to("dau-all").emit("dau-update", data)
  }

  // Broadcast alerts
  broadcastAlert(alert: any) {
    this.server.emit("dau-alert", alert)
  }
}
