export class QueryBulkActionsDto {
  status?: "pending" | "preview" | "executing" | "completed" | "failed" | "partial"
  actionType?: "update" | "delete" | "archive" | "restore" | "configure"
  executedBy?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}
