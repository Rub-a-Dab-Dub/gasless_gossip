import { IsString, IsOptional, IsUrl, IsArray, ValidateNested, IsUUID, IsDecimal } from "class-validator"
import { Type, Transform } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class NftAttributeDto {
  @ApiProperty({
    description: "The trait type/category",
    example: "Background",
  })
  @IsString()
  trait_type: string

  @ApiProperty({
    description: "The trait value",
    example: "Blue",
  })
  @IsString()
  value: string | number
}

export class NftMetadataDto {
  @ApiProperty({
    description: "Name of the NFT",
    example: "Whisper Collectible #001",
    maxLength: 100,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string

  @ApiProperty({
    description: "Description of the NFT",
    example: "A rare collectible from the Whisper universe",
    maxLength: 1000,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  description: string

  @ApiProperty({
    description: "URL to the NFT image",
    example: "https://example.com/nft-image.png",
  })
  @IsUrl()
  image: string

  @ApiPropertyOptional({
    description: "Array of NFT attributes/traits",
    type: [NftAttributeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftAttributeDto)
  attributes?: NftAttributeDto[]

  @ApiPropertyOptional({
    description: "External URL for more information",
    example: "https://whisper.com/collectibles/001",
  })
  @IsOptional()
  @IsUrl()
  external_url?: string

  @ApiPropertyOptional({
    description: "URL to animation/video file",
    example: "https://example.com/nft-animation.mp4",
  })
  @IsOptional()
  @IsUrl()
  animation_url?: string

  @ApiPropertyOptional({
    description: "Background color as hex code (without #)",
    example: "FF0000",
  })
  @IsOptional()
  @IsString()
  background_color?: string
}

export class CreateNftDto {
  @ApiProperty({
    description: "NFT metadata following OpenSea standards",
    type: NftMetadataDto,
  })
  @ValidateNested()
  @Type(() => NftMetadataDto)
  metadata: NftMetadataDto

  @ApiPropertyOptional({
    description: "Stellar address to receive the NFT (defaults to user's address)",
    example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
  })
  @IsOptional()
  @IsString()
  recipientStellarAddress?: string

  @ApiPropertyOptional({
    description: "Collection ID to associate this NFT with",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  collectionId?: string

  @ApiPropertyOptional({
    description: "Mint price in XLM",
    example: "10.5000000",
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: "0,7" })
  mintPrice?: string
}
