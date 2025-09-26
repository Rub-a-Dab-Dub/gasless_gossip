import { IsString, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class TransferNftDto {
  @ApiProperty({
    description: "ID of the NFT to transfer",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  nftId: string

  @ApiProperty({
    description: "ID of the user to transfer the NFT to",
    example: "987fcdeb-51a2-43d1-9f12-345678901234",
  })
  @IsUUID()
  toUserId: string

  @ApiProperty({
    description: "Stellar address of the recipient",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  @IsString()
  toStellarAddress: string
}
