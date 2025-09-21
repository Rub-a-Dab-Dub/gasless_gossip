import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { CreateSecretDto } from './dto/create-secret.dto';
import { SecretResponseDto } from './dto/secret-response.dto';

// Assuming you have room access guard
// @UseGuards(RoomAccessGuard)
@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Post()
  async createSecret(
    @Body() createSecretDto: CreateSecretDto,
    // @Request() req, // Use to verify room access
  ): Promise<SecretResponseDto> {
    return this.secretsService.createSecret(createSecretDto);
  }

  @Get('top')
  async getTopSecrets(
    @Query('roomId') roomId: string,
    @Query('limit') limit?: number,
  ): Promise<SecretResponseDto[]> {
    return this.secretsService.getTopSecrets(roomId, limit);
  }

  @Post(':id/react')
  async reactToSecret(@Param('id') id: string): Promise<SecretResponseDto> {
    return this.secretsService.incrementReaction(id);
  }
}