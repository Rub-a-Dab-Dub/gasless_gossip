import { Injectable } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import type { BulkAction } from "./entities/bulk-action.entity"
import type { RoomActionResult } from "./entities/room-action-result.entity"
import type { BulkActionNotification } from "./entities/bulk-action-notification.entity"
import type { CreateBulkActionDto } from "./dto/create-bulk-action.dto"
import type { ExecuteBulkActionDto } from "./dto/execute-bulk-action.dto"
import type { RollbackBulkActionDto } from "./dto/rollback-bulk-action.dto"
import type { QueryBulkActionsDto } from "./dto/query-bulk-actions.dto"

@Injectable()
export class BulkRoomActionService {
  private bulkActionRepo: Repository<BulkAction>
  private roomActionResultRepo: Repository<RoomActionResult>
  private notificationRepo: Repository<BulkActionNotification>
  private dataSource: DataSource

  constructor(
    bulkActionRepo: Repository<BulkAction>,
    roomActionResultRepo: Repository<RoomActionResult>,
    notificationRepo: Repository<BulkActionNotification>,
    dataSource: DataSource,
  ) {
    this.bulkActionRepo = bulkActionRepo
    this.roomActionResultRepo = roomActionResultRepo
    this.notificationRepo = notificationRepo
    this.dataSource = dataSource
  }

  // Select preview - Create bulk action in preview mode
  async createBulkAction(dto: CreateBulkActionDto): Promise<{
    bulkAction: BulkAction
    preview: {
      totalRooms: number
      estimatedTime: string
      affectedRooms: string[]
      validationErrors: Array<{ roomId: string; error: string }>
    }
  }> {
    // Validate rooms
    const validationErrors = await this.validateRooms(dto.targetRoomIds, dto.actionType, dto.actionPayload)

    const bulkAction = this.bulkActionRepo.create({
      actionType: dto.actionType,
      targetRoomIds: dto.targetRoomIds,
      actionPayload: dto.actionPayload,
      status: "preview",
      totalRooms: dto.targetRoomIds.length,
      isDryRun: dto.isDryRun || false,
    })

    await this.bulkActionRepo.save(bulkAction)

    // Calculate estimated time (assuming 50ms per room)
    const estimatedTimeMs = dto.targetRoomIds.length * 50
    const estimatedTime = this.formatExecutionTime(estimatedTimeMs)

    return {
      bulkAction,
      preview: {
        totalRooms: dto.targetRoomIds.length,
        estimatedTime,
        affectedRooms: dto.targetRoomIds,
        validationErrors,
      },
    }
  }

  // Execute batch - Run the bulk action
  async executeBulkAction(dto: ExecuteBulkActionDto): Promise<BulkAction> {
    const bulkAction = await this.bulkActionRepo.findOne({
      where: { id: dto.bulkActionId },
    })

    if (!bulkAction) {
      throw new Error("Bulk action not found")
    }

    if (bulkAction.status === "executing") {
      throw new Error("Bulk action is already executing")
    }

    // Update status to executing
    bulkAction.status = "executing"
    bulkAction.executedBy = dto.executedBy
    bulkAction.executedAt = new Date()
    await this.bulkActionRepo.save(bulkAction)

    // Send notification
    await this.createNotification(bulkAction.id, dto.executedBy, "started", "Bulk action execution started")

    // Execute in background (in production, use a queue like Bull)
    this.executeInBackground(bulkAction)

    return bulkAction
  }

  private async executeInBackground(bulkAction: BulkAction): Promise<void> {
    const startTime = Date.now()
    let successCount = 0
    let failureCount = 0
    const errors: Array<{ roomId: string; error: string }> = []

    // Process rooms in batches of 10 for better performance
    const batchSize = 10
    const roomBatches = this.chunkArray(bulkAction.targetRoomIds, batchSize)

    for (const batch of roomBatches) {
      // Use transaction for each batch
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        for (const roomId of batch) {
          try {
            const result = await this.executeRoomAction(
              roomId,
              bulkAction.actionType,
              bulkAction.actionPayload,
              bulkAction.isDryRun,
              queryRunner,
            )

            await this.roomActionResultRepo.save({
              bulkActionId: bulkAction.id,
              roomId,
              status: result.success ? "success" : "failed",
              previousState: result.previousState,
              newState: result.newState,
              errorMessage: result.error,
              executionTimeMs: result.executionTime,
            })

            if (result.success) {
              successCount++
            } else {
              failureCount++
              errors.push({ roomId, error: result.error || "Unknown error" })
            }
          } catch (error) {
            failureCount++
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            errors.push({ roomId, error: errorMessage })

            await this.roomActionResultRepo.save({
              bulkActionId: bulkAction.id,
              roomId,
              status: "failed",
              errorMessage,
            })
          }
        }

        await queryRunner.commitTransaction()
      } catch (error) {
        // Rollback the batch on failure
        await queryRunner.rollbackTransaction()

        // Mark all rooms in this batch as failed
        for (const roomId of batch) {
          failureCount++
          errors.push({ roomId, error: "Batch transaction failed" })
        }
      } finally {
        await queryRunner.release()
      }
    }

    const executionTime = Date.now() - startTime

    // Update bulk action with results
    bulkAction.successCount = successCount
    bulkAction.failureCount = failureCount
    bulkAction.errors = errors
    bulkAction.executionTimeMs = executionTime
    bulkAction.status = failureCount === 0 ? "completed" : failureCount === bulkAction.totalRooms ? "failed" : "partial"

    await this.bulkActionRepo.save(bulkAction)

    // Send completion notification
    const notificationType =
      bulkAction.status === "completed" ? "completed" : bulkAction.status === "failed" ? "failed" : "partial_success"

    await this.createNotification(
      bulkAction.id,
      bulkAction.executedBy!,
      notificationType,
      `Bulk action ${bulkAction.status}. Success: ${successCount}, Failed: ${failureCount}`,
    )
  }

  private async executeRoomAction(
    roomId: string,
    actionType: string,
    payload: Record<string, any>,
    isDryRun: boolean,
    queryRunner: any,
  ): Promise<{
    success: boolean
    previousState?: Record<string, any>
    newState?: Record<string, any>
    error?: string
    executionTime: number
  }> {
    const startTime = Date.now()

    try {
      // Fetch current room state
      const room = await queryRunner.manager.findOne("Room", { where: { id: roomId } })

      if (!room) {
        return {
          success: false,
          error: "Room not found",
          executionTime: Date.now() - startTime,
        }
      }

      const previousState = { ...room }

      if (isDryRun) {
        // Dry run - don't actually modify
        return {
          success: true,
          previousState,
          newState: { ...room, ...payload },
          executionTime: Date.now() - startTime,
        }
      }

      // Execute the action based on type
      let newState: Record<string, any>

      switch (actionType) {
        case "update":
          await queryRunner.manager.update("Room", { id: roomId }, payload)
          newState = { ...room, ...payload }
          break

        case "delete":
          await queryRunner.manager.delete("Room", { id: roomId })
          newState = { deleted: true }
          break

        case "archive":
          await queryRunner.manager.update("Room", { id: roomId }, { isArchived: true, archivedAt: new Date() })
          newState = { ...room, isArchived: true }
          break

        case "restore":
          await queryRunner.manager.update("Room", { id: roomId }, { isArchived: false, archivedAt: null })
          newState = { ...room, isArchived: false }
          break

        case "configure":
          await queryRunner.manager.update("Room", { id: roomId }, { config: payload })
          newState = { ...room, config: payload }
          break

        default:
          return {
            success: false,
            error: `Unknown action type: ${actionType}`,
            executionTime: Date.now() - startTime,
          }
      }

      return {
        success: true,
        previousState,
        newState,
        executionTime: Date.now() - startTime,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: Date.now() - startTime,
      }
    }
  }

  // Rollback fails - Revert changes for failed rooms or entire action
  async rollbackBulkAction(dto: RollbackBulkActionDto): Promise<{
    success: boolean
    rolledBackCount: number
    errors: Array<{ roomId: string; error: string }>
  }> {
    const bulkAction = await this.bulkActionRepo.findOne({
      where: { id: dto.bulkActionId },
    })

    if (!bulkAction) {
      throw new Error("Bulk action not found")
    }

    // Get results to rollback
    const resultsQuery = this.roomActionResultRepo
      .createQueryBuilder("result")
      .where("result.bulkActionId = :bulkActionId", {
        bulkActionId: dto.bulkActionId,
      })
      .andWhere("result.status IN (:...statuses)", {
        statuses: ["success", "failed"],
      })

    if (dto.roomIds && dto.roomIds.length > 0) {
      resultsQuery.andWhere("result.roomId IN (:...roomIds)", {
        roomIds: dto.roomIds,
      })
    }

    const results = await resultsQuery.getMany()

    let rolledBackCount = 0
    const errors: Array<{ roomId: string; error: string }> = []

    // Rollback each room
    for (const result of results) {
      if (!result.previousState) {
        errors.push({
          roomId: result.roomId,
          error: "No previous state available for rollback",
        })
        continue
      }

      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        // Restore previous state
        await queryRunner.manager.update("Room", { id: result.roomId }, result.previousState)

        // Update result status
        result.status = "rolled_back"
        await this.roomActionResultRepo.save(result)

        await queryRunner.commitTransaction()
        rolledBackCount++
      } catch (error) {
        await queryRunner.rollbackTransaction()
        errors.push({
          roomId: result.roomId,
          error: error instanceof Error ? error.message : "Rollback failed",
        })
      } finally {
        await queryRunner.release()
      }
    }

    return {
      success: errors.length === 0,
      rolledBackCount,
      errors,
    }
  }

  // Notify - Create notifications
  async createNotification(
    bulkActionId: string,
    recipientId: string,
    notificationType: "started" | "completed" | "failed" | "partial_success",
    message: string,
    metadata?: Record<string, any>,
  ): Promise<BulkActionNotification> {
    const notification = this.notificationRepo.create({
      bulkActionId,
      recipientId,
      notificationType,
      message,
      metadata,
    })

    return this.notificationRepo.save(notification)
  }

  async getNotifications(recipientId: string, isRead?: boolean): Promise<BulkActionNotification[]> {
    const query: any = { recipientId }
    if (isRead !== undefined) {
      query.isRead = isRead
    }

    return this.notificationRepo.find({
      where: query,
      order: { createdAt: "DESC" },
    })
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.notificationRepo.update(notificationId, { isRead: true })
  }

  // Query bulk actions
  async getBulkActions(query: QueryBulkActionsDto): Promise<{
    actions: BulkAction[]
    total: number
  }> {
    const qb = this.bulkActionRepo.createQueryBuilder("action")

    if (query.status) {
      qb.andWhere("action.status = :status", { status: query.status })
    }

    if (query.actionType) {
      qb.andWhere("action.actionType = :actionType", {
        actionType: query.actionType,
      })
    }

    if (query.executedBy) {
      qb.andWhere("action.executedBy = :executedBy", {
        executedBy: query.executedBy,
      })
    }

    if (query.startDate && query.endDate) {
      qb.andWhere("action.createdAt BETWEEN :startDate AND :endDate", {
        startDate: query.startDate,
        endDate: query.endDate,
      })
    }

    qb.orderBy("action.createdAt", "DESC")

    const total = await qb.getCount()

    if (query.limit) {
      qb.limit(query.limit)
    }

    if (query.offset) {
      qb.offset(query.offset)
    }

    const actions = await qb.getMany()

    return { actions, total }
  }

  async getBulkActionById(id: string): Promise<BulkAction> {
    return this.bulkActionRepo.findOne({ where: { id } })
  }

  async getRoomActionResults(bulkActionId: string): Promise<RoomActionResult[]> {
    return this.roomActionResultRepo.find({
      where: { bulkActionId },
      order: { createdAt: "ASC" },
    })
  }

  // Validation
  private async validateRooms(
    roomIds: string[],
    actionType: string,
    payload: Record<string, any>,
  ): Promise<Array<{ roomId: string; error: string }>> {
    const errors: Array<{ roomId: string; error: string }> = []

    // Add validation logic here
    // For example: check if rooms exist, check permissions, validate payload

    return errors
  }

  // Utility methods
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  private formatExecutionTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }
}
