import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarResponseDto } from './dto/avatar-response.dto';
// Assuming you have authentication guards
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Avatars')
@Controller('avatars')
// @UseGuards(JwtAuthGuard) // Uncomment if you have auth guards
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post('mint')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Mint a new NFT avatar for the authenticated user' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAvatarDto })
  @ApiResponse({
    status!: 201,
    description: 'Avatar successfully minted',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already has an active avatar',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or Stellar transaction failed',
  })
  async mintAvatar(
    @Body() createAvatarDto: CreateAvatarDto,
    @Request() req: any, // Replace with your user type
  ): Promise<AvatarResponseDto> {
    // Extract user info from request (adjust based on your auth implementation)
    const userId = req.user?.id || req.user?.userId;
    const stellarPublicKey =
      req.user?.stellarPublicKey || req.body.stellarPublicKey;

    // For demo purposes, you might need to pass stellarPublicKey in the request body
    // In production, this should come from the authenticated user's profile

    return this.avatarsService.mintAvatar(
      userId,
      createAvatarDto,
      stellarPublicKey,
    );
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get avatar by user ID' })
  @ApiParam({
    name!: 'userId',
    description: 'User UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar found',
    type: AvatarResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar not found',
  })
  async getAvatar(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<AvatarResponseDto> {
    return this.avatarsService.getUserAvatar(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all avatars' })
  @ApiResponse({
    status!: 200,
    description: 'List of all avatars',
    type: [AvatarResponseDto],
  })
  async getAllAvatars(): Promise<AvatarResponseDto[]> {
    return this.avatarsService.getAllAvatars();
  }
}
