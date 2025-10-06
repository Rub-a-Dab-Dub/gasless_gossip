export class CreateWhitelistDto {
  identifier: string
  type: "ip" | "user" | "apiKey"
  reason?: string
  expiresAt?: Date
}
