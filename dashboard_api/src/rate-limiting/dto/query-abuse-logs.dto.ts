export class QueryAbuseLogsDto {
  identifier?: string
  endpoint?: string
  severity?: "low" | "medium" | "high" | "critical"
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}
