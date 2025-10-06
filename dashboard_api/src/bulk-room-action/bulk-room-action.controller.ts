import { Controller, Get, Post, Put } from "@nestjs/common"
import type { BulkRoomActionService } from "./bulk-room-action.service"
import type { CreateBulkActionDto } from "./dto/create-bulk-action.dto"
import type { ExecuteBulkActionDto } from "./dto/execute-bulk-action.dto"
import type { RollbackBulkActionDto } from "./dto/rollback-bulk-action.dto"
import type { QueryBulkActionsDto } from "./dto/query-bulk-actions.dto"

@Controller("bulk-room-action")
export class BulkRoomActionController {
  constructor(private readonly bulkRoomActionService: BulkRoomActionService) {}

  // Select preview
  @Post("preview")
  async createBulkAction(dto: CreateBulkActionDto) {
    return this.bulkRoomActionService.createBulkAction(dto)
  }

  // Execute batch
  @Post("execute")
  async executeBulkAction(dto: ExecuteBulkActionDto) {
    return this.bulkRoomActionService.executeBulkAction(dto)
  }

  // Rollback fails
  @Post("rollback")
  async rollbackBulkAction(dto: RollbackBulkActionDto) {
    return this.bulkRoomActionService.rollbackBulkAction(dto)
  }

  // Get bulk actions
  @Get("actions")
  async getBulkActions(query: QueryBulkActionsDto) {
    return this.bulkRoomActionService.getBulkActions(query)
  }

  @Get("actions/:id")
  async getBulkActionById(id: string) {
    return this.bulkRoomActionService.getBulkActionById(id)
  }

  @Get("actions/:id/results")
  async getRoomActionResults(id: string) {
    return this.bulkRoomActionService.getRoomActionResults(id)
  }

  // Notifications
  @Get("notifications/:recipientId")
  async getNotifications(recipientId: string, isRead?: boolean) {
    return this.bulkRoomActionService.getNotifications(recipientId, isRead)
  }

  @Put("notifications/:id/read")
  async markNotificationAsRead(id: string) {
    await this.bulkRoomActionService.markNotificationAsRead(id)
    return { message: "Notification marked as read" }
  }
}
