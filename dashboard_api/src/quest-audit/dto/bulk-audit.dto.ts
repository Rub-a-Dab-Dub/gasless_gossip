import { IsArray, IsString, IsUUID } from "class-validator"

export class BulkAuditDto {
  @IsArray()
  @IsUUID("4", { each: true })
  completionIds: string[]

  @IsString()
  action: "flag" | "reverse" | "clear"

  @IsString()
  reason: string

  @IsString()
  performedBy: string
}
