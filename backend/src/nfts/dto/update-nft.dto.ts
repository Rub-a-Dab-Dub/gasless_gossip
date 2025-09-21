import { IsOptional, ValidateNested, IsNumber, Min, Max } from "class-validator"
import { Type } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { NftMetadataDto } from "./create-nft.dto"

export class UpdateNftDto {
  @ApiPropertyOptional({
    description: "Updated NFT metadata",
    type: NftMetadataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NftMetadataDto)
  metadata?: Partial<NftMetadataDto>

  @ApiPropertyOptional({
    description: "Updated rarity score",
    example: 85.5,
    minimum: 0,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  rarityScore?: number
}
