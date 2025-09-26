import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import {
  ReactionResponseDto,
  ReactionCountDto,
} from './dto/reaction-response.dto';

@ApiTags('reactions')
@Controller('reactions')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is implemented
@ApiBearerAuth()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update a reaction to a message' })
  @ApiResponse({
    status: 201,
    description: 'Reaction created successfully',
    type: ReactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'No access to message' })
  @ApiResponse({ status: 409, description: 'Duplicate reaction' })
  async createReaction(
    @Body() createReactionDto: CreateReactionDto,
    @Request() req: any, // Replace with proper user type
  ): Promise<ReactionResponseDto> {
    // Extract user ID from JWT token (implement based on your auth system)
    const userId = req.user?.id || 'user-123'; // Placeholder

    return this.reactionsService.createReaction(createReactionDto, userId);
  }

  @Get(':messageId')
  @ApiOperation({ summary: 'Get all reactions for a message' })
  @ApiParam({
    name: 'messageId',
    description: 'UUID of the message',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reactions retrieved successfully',
    type: ReactionCountDto,
  })
  @ApiResponse({ status: 403, description: 'No access to message' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async getReactionsByMessage(
    @Param('messageId') messageId: string,
    @Request() req: any,
  ): Promise<ReactionCountDto> {
    const userId = req.user?.id || 'user-123';
    return this.reactionsService.getReactionsByMessage(messageId, userId);
  }

  @Get(':messageId/my-reaction')
  @ApiOperation({ summary: "Get current user's reaction to a message" })
  @ApiParam({ name: 'messageId', description: 'UUID of the message' })
  @ApiResponse({
    status: 200,
    description: 'User reaction retrieved',
    type: ReactionResponseDto,
  })
  async getUserReaction(
    @Param('messageId') messageId: string,
    @Request() req: any,
  ): Promise<ReactionResponseDto | null> {
    const userId = req.user?.id || 'user-123';
    return this.reactionsService.getUserReactionForMessage(messageId, userId);
  }

  @Delete(':messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove user's reaction from a message" })
  @ApiParam({ name: 'messageId', description: 'UUID of the message' })
  @ApiResponse({ status: 204, description: 'Reaction removed successfully' })
  @ApiResponse({ status: 404, description: 'Reaction not found' })
  async removeReaction(
    @Param('messageId') messageId: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user?.id || 'user-123';
    return this.reactionsService.removeReaction(messageId, userId);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get reaction statistics (admin only)' })
  // @UseGuards(RolesGuard) // Uncomment and configure for admin access
  async getReactionStats(): Promise<any> {
    return this.reactionsService.getReactionStats();
  }
}
