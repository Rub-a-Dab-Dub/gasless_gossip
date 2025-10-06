import { IsString, IsUUID } from "class-validator"

export class ReverseCompletionDto {
  @IsUUID()
  completionId: string

  @IsString()
  reason: string

  @IsString()
  reversedBy: string
}
