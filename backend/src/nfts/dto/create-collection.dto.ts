import { IsString, IsOptional, IsUrl, IsNumber, Min, Max, ValidateNested } from "class-validator"
import { Type, Transform } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CollectionMetadataDto {
  @ApiProperty({
    description: "Collection name",
    example: "Whisper Legends",
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string

  @ApiProperty({
    description: "Collection description",
    example: "A collection of legendary characters from the Whisper universe",
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  description: string

  @ApiProperty({
    description: "Collection image URL",
    example: "https://example.com/collection-image.png",
  })
  @IsUrl()
  image: string

  @ApiPropertyOptional({
    description: "Collection banner image URL",
    example: "https://example.com/collection-banner.png",
  })
  @IsOptional()
  @IsUrl()
  banner_image?: string

  @ApiPropertyOptional({
    description: "External link for the collection",
    example: "https://whisper.com/collections/legends",
  })
  @IsOptional()
  @IsUrl()
  external_link?: string

  @ApiPropertyOptional({
    description: "Seller fee in basis points (100 = 1%)",
    example: 250,
    minimum: 0,
    maximum: 10000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  seller_fee_basis_points?: number

  @ApiPropertyOptional({
    description: "Fee recipient address",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  @IsOptional()
  @IsString()
  fee_recipient?: string
}

export class CreateCollectionDto {
  @ApiProperty({
    description: "Collection name (must be unique)",
    example: "Whisper Legends",
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string

  @ApiProperty({
    description: "Collection symbol (must be unique)",
    example: "WLEG",
  })
  @IsString()
  @Transform(({ value }) => value?.trim().toUpperCase())
  symbol: string

  @ApiProperty({
    description: "Collection description",
    example: "A collection of legendary characters from the Whisper universe",
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  description: string

  @ApiProperty({
    description: "Collection metadata",
    type: CollectionMetadataDto,
  })
  @ValidateNested()
  @Type(() => CollectionMetadataDto)
  metadata: CollectionMetadataDto

  @ApiPropertyOptional({
    description: "Maximum supply of NFTs in this collection",
    example: 10000,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxSupply?: number
}
