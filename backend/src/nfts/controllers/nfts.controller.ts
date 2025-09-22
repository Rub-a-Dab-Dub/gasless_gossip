import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from "@nestjs/swagger"
import type { NftsService } from "../services/nfts.service"
import type { CreateNftDto } from "../dto/create-nft.dto"
import type { TransferNftDto } from "../dto/transfer-nft.dto"
import { NftResponseDto } from "../dto/nft-response.dto"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { User } from "../../users/entities/user.entity"

@ApiTags("NFTs")
@Controller("nfts")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Post("mint")
  @ApiOperation({ summary: "Mint a new NFT" })
  @ApiResponse({
    status!: HttpStatus.CREATED,
    description: "NFT minted successfully",
    type: NftResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid metadata or minting parameters",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Failed to mint NFT on Stellar network",
  })
  async mintNft(user: User, @Body(ValidationPipe) createNftDto: CreateNftDto): Promise<NftResponseDto> {
    const nft = await this.nftsService.mintNft({
      userId: user.id,
      metadata: createNftDto.metadata,
      recipientStellarAddress: createNftDto.recipientStellarAddress || user.stellarAccountId,
      collectionId: createNftDto.collectionId,
      mintPrice: createNftDto.mintPrice,
    })

    return new NftResponseDto(nft)
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get NFTs owned by a user" })
  @ApiParam({
    name: "userId",
    description: "User ID to get NFTs for",
    type: "string",
    format: "uuid",
  })
  @ApiQuery({
    name: "collectionId",
    description: "Filter by collection ID",
    required: false,
    type: "string",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of NFTs to return",
    required: false,
    type: "number",
    example: 20,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of NFTs to skip",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of NFTs owned by the user",
    type: [NftResponseDto],
  })
  async getNftsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('collectionId') collectionId?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<NftResponseDto[]> {
    const nfts = await this.nftsService.findNftsByUser(userId)

    // Apply filters and pagination
    let filteredNfts = nfts

    if (collectionId) {
      filteredNfts = nfts.filter((nft) => nft.collectionId === collectionId)
    }

    const paginatedNfts = filteredNfts.slice(offset, offset + limit)

    return paginatedNfts.map((nft) => new NftResponseDto(nft))
  }

  @Get('details/:id')
  @ApiOperation({ summary: 'Get NFT details by ID' })
  @ApiParam({
    name: 'id',
    description: 'NFT ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NFT details',
    type: NftResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NFT not found',
  })
  async getNftById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NftResponseDto> {
    const nft = await this.nftsService.findNftById(id);
    return new NftResponseDto(nft);
  }

  @Get('transaction/:txId')
  @ApiOperation({ summary: 'Get NFT by transaction ID' })
  @ApiParam({
    name!: 'txId',
    description: 'Stellar transaction ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NFT details',
    type: NftResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NFT not found',
  })
  async getNftByTxId(
    @Param('txId') txId: string,
  ): Promise<NftResponseDto> {
    const nft = await this.nftsService.findNftByTxId(txId);
    return new NftResponseDto(nft);
  }

  @Post("transfer")
  @ApiOperation({ summary: "Transfer NFT to another user" })
  @ApiResponse({
    status!: HttpStatus.OK,
    description: "NFT transferred successfully",
    type: NftResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "NFT not found or not owned by user",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid transfer parameters",
  })
  async transferNft(user: User, @Body(ValidationPipe) transferNftDto: TransferNftDto): Promise<NftResponseDto> {
    const nft = await this.nftsService.transferNft({
      nftId: transferNftDto.nftId,
      fromUserId: user.id,
      toUserId: transferNftDto.toUserId,
      toStellarAddress: transferNftDto.toStellarAddress,
    })

    return new NftResponseDto(nft)
  }

  @Post(':id/calculate-rarity')
  @ApiOperation({ summary: 'Calculate rarity score for an NFT' })
  @ApiParam({
    name: 'id',
    description: 'NFT ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rarity score calculated',
    schema: {
      type: 'object',
      properties: {
        nftId: { type: 'string' },
        rarityScore: { type: 'number' },
      },
    },
  })
  async calculateRarity(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ nftId: string; rarityScore: number }> {
    const rarityScore = await this.nftsService.calculateRarityScore(id);
    return { nftId: id, rarityScore };
  }

  @Get(":id/verify-ownership/:userId")
  @ApiOperation({ summary: "Verify NFT ownership" })
  @ApiParam({
    name!: "id",
    description: "NFT ID",
    type: "string",
    format: "uuid",
  })
  @ApiParam({
    name: "userId",
    description: "User ID to verify ownership for",
    type: "string",
    format: "uuid",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ownership verification result",
    schema: {
      type: "object",
      properties: {
        nftId: { type: "string" },
        userId: { type: "string" },
        isOwner: { type: "boolean" },
      },
    },
  })
  async verifyOwnership(
    @Param('id', ParseUUIDPipe) nftId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ nftId: string; userId: string; isOwner: boolean }> {
    const isOwner = await this.nftsService.verifyNftOwnership(nftId, userId)
    return { nftId, userId, isOwner }
  }

  @Get("collections/:collectionId/nfts")
  @ApiOperation({ summary: "Get NFTs from a specific collection" })
  @ApiParam({
    name: "collectionId",
    description: "Collection ID",
    type: "string",
    format: "uuid",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of NFTs to return",
    required: false,
    type: "number",
    example: 20,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of NFTs to skip",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of NFTs from the collection",
    type: [NftResponseDto],
  })
  async getNftsByCollection(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<NftResponseDto[]> {
    // This would need to be implemented in the service
    // For now, return empty array
    return []
  }
}
