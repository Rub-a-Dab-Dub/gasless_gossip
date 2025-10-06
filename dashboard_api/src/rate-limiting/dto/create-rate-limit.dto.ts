export class CreateRateLimitDto {
  name: string
  endpoint?: string
  role?: string
  ttl: number
  limit: number
  burstLimit?: number
  priority?: number
}
