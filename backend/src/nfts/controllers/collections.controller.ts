import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { User } from "../../users/entities/user.entity"
import type { CreateCollectionDto } from "../dto/create-collection.dto"
import { CollectionResponseDto } from "../dto/collection-response.dto"

@ApiTags("NFT Collections")
@Controller("nft-collections")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionsController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: "Create a new NFT collection" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Collection created successfully",
    type: CollectionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid collection data",
  })
  async createCollection(
    user: User,
    @Body(ValidationPipe) createCollectionDto: CreateCollectionDto,
  ): Promise<CollectionResponseDto> {
    // Implementation would go here
    throw new Error("Not implemented yet")
  }

  @Get()
  @ApiOperation({ summary: "Get all NFT collections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of NFT collections",
    type: [CollectionResponseDto],
  })
  async getCollections(): Promise<CollectionResponseDto[]> {
    // Implementation would go here
    return []
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiParam({
    name: 'id',
    description: 'Collection ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection details',
    type: CollectionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found',
  })
  async getCollectionById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CollectionResponseDto> {
    // Implementation would go here
    throw new Error('Not implemented yet');
  }
}
