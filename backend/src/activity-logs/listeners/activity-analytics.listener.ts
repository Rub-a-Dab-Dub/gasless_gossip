import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import type { ActivityLoggedEvent } from "../events/activity-logged.event"
import type { ActivityLog } from "../entities/activity-log.entity" // Import ActivityLog
import { ActivityAction } from "../entities/activity-log.entity"

@Injectable()
export class ActivityAnalyticsListener {
  @OnEvent("activity.logged")
  async handleActivityLogged(event: ActivityLoggedEvent) {
    const { activityLog } = event

    // Log for debugging
    console.log(`[v0] Activity logged: ${activityLog.action} by user ${activityLog.userId}`)

    // Handle specific actions for real-time analytics
    switch (activityLog.action) {
      case ActivityAction.MESSAGE_SENT:
        await this.handleMessageSent(activityLog)
        break
      case ActivityAction.TIP_SENT:
        await this.handleTipSent(activityLog)
        break
      case ActivityAction.ROOM_JOINED:
        await this.handleRoomJoined(activityLog)
        break
      case ActivityAction.LEVEL_UP:
        await this.handleLevelUp(activityLog)
        break
      case ActivityAction.BADGE_EARNED:
        await this.handleBadgeEarned(activityLog)
        break
      default:
        // Handle generic activity
        await this.handleGenericActivity(activityLog)
    }
  }

  private async handleMessageSent(activityLog: ActivityLog) {
    // Update user engagement metrics
    // Could trigger notifications, update leaderboards, etc.
    console.log(`[v0] Processing message sent activity for user ${activityLog.userId}`)
  }

  private async handleTipSent(activityLog: ActivityLog) {
    // Update tipping statistics
    // Could trigger notifications to recipient, update economy metrics
    console.log(`[v0] Processing tip sent activity: ${activityLog.amount} to user ${activityLog.targetUserId}`)
  }

  private async handleRoomJoined(activityLog: ActivityLog) {
    // Update room activity metrics
    // Could trigger welcome messages, update room popularity
    console.log(`[v0] Processing room joined activity: user ${activityLog.userId} joined room ${activityLog.roomId}`)
  }

  private async handleLevelUp(activityLog: ActivityLog) {
    // Celebrate level up achievements
    // Could trigger notifications, unlock new features
    console.log(`[v0] Processing level up activity for user ${activityLog.userId}`)
  }

  private async handleBadgeEarned(activityLog: ActivityLog) {
    // Handle badge achievements
    // Could trigger notifications, update profile displays
    console.log(`[v0] Processing badge earned activity for user ${activityLog.userId}`)
  }

  private async handleGenericActivity(activityLog: ActivityLog) {
    // Handle any other activity types
    console.log(`[v0] Processing generic activity: ${activityLog.action} for user ${activityLog.userId}`)
  }
}
