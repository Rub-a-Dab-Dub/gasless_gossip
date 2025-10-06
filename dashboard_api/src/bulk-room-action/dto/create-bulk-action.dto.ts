export class CreateBulkActionDto {
  actionType: "update" | "delete" | "archive" | "restore" | "configure"
  targetRoomIds: string[]
  actionPayload: Record<string, any>
  isDryRun?: boolean
}
