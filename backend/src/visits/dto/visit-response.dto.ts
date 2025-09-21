import { ApiProperty } from "@nestjs/swagger"

export class VisitResponseDto {
  @ApiProperty({
    description: "Visit identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string

  @ApiProperty({
    description: "Room identifier",
    example: "room-123",
  })
  roomId: string

  @ApiProperty({
    description: "User identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  userId: string

  @ApiProperty({
    description: "Visit timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  createdAt: Date

  @ApiProperty({
    description: "Visit duration in seconds",
    example: 300,
  })
  duration: number

  @ApiProperty({
    description: "User information",
    required: false,
  })
  user?: {
    id: string
    username: string
    pseudonym?: string
  }
}
