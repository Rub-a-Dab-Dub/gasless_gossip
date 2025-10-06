export class RollbackBulkActionDto {
  bulkActionId: string
  roomIds?: string[] // Optional: rollback specific rooms only
  reason?: string
}
