export class UpdateRateLimitDto {
  name?: string
  endpoint?: string
  role?: string
  ttl?: number
  limit?: number
  burstLimit?: number
  isActive?: boolean
  priority?: number
}
