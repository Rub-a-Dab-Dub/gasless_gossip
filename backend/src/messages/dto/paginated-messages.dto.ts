import { ApiProperty } from "@nestjs/swagger"
import { Message } from "../entities/message.entity"

export class PaginationMetaDto {
  @ApiProperty({ description: "Current page number" })
  page: number

  @ApiProperty({ description: "Number of items per page" })
  limit: number

  @ApiProperty({ description: "Total number of items" })
  totalItems: number

  @ApiProperty({ description: "Total number of pages" })
  totalPages: number

  @ApiProperty({ description: "Whether there is a next page" })
  hasNextPage: boolean

  @ApiProperty({ description: "Whether there is a previous page" })
  hasPreviousPage: boolean
}

export class PaginatedMessagesDto {
  @ApiProperty({ type: [Message], description: "Array of messages" })
  data: Message[]

  @ApiProperty({ type: PaginationMetaDto, description: "Pagination metadata" })
  meta: PaginationMetaDto
}
