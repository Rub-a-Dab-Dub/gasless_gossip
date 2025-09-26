import { IsString, Length, Matches, IsOptional, IsUUID } from "class-validator"
import { Transform } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class AcceptInvitationDto {
  @ApiProperty({
    description: "Invitation code to accept",
    example: "ABC123DEF456",
    minLength: 12,
    maxLength: 12,
  })
  @IsString()
  @Length(12, 12, { message: "Invitation code must be exactly 12 characters" })
  @Matches(/^[A-Z0-9]{12}$/, { message: "Invitation code must contain only uppercase letters and numbers" })
  @Transform(({ value }) => value?.toUpperCase().trim())
  code: string

  @ApiPropertyOptional({ description: "Optional Stellar transaction ID for verification" })
  @IsOptional()
  @IsString()
  stellarTxId?: string

  @ApiPropertyOptional({ description: "User ID accepting the invitation (if different from authenticated user)" })
  @IsOptional()
  @IsUUID(4)
  userId?: string
}
