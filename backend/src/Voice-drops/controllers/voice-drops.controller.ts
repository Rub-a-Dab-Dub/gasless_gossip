import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    Query,
    UploadedFile,
    UseInterceptors,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
  import { VoiceDropsService } from '../services/voice-drops.service';
  import { CreateVoiceDropDto, VoiceDropResponseDto, GetVoiceDropsDto } from '../dto';
  
  // Assuming you have these decorators/guards
  // import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  // import { GetUser } from '../../auth/decorators/get-user.decorator';
  
  @ApiTags('Voice Drops')
  @Controller('voice-drops')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  export class VoiceDropsController {
    constructor(private voiceDropsService: VoiceDropsService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('audio'))
    @ApiOperation({ summary: 'Upload a voice drop to a room' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
      status: 201,
      description: 'Voice drop created successfully',
      type: VoiceDropResponseDto,
    })
    async createVoiceDrop(
      @Body() createVoiceDropDto: CreateVoiceDropDto,
      @UploadedFile() audioFile: Express.Multer.File,
      // @GetUser('id') userId: string, // Comment out for now
    ): Promise<VoiceDropResponseDto> {
      // For testing purposes, use a mock user ID
      const userId = 'mock-user-id';
      
      return this.voiceDropsService.createVoiceDrop(createVoiceDropDto, audioFile, userId);
    }
  
    @Get(':roomId')
    @ApiOperation({ summary: 'Get voice drops for a room' })
    @ApiResponse({
      status: 200,
      description: 'Voice drops retrieved successfully',
      type: [VoiceDropResponseDto],
    })
    async getVoiceDropsByRoom(
      @Param('roomId', ParseUUIDPipe) roomId: string,
      @Query() query: GetVoiceDropsDto,
      // @GetUser('id') userId: string, // Comment out for now
    ) {
      // For testing purposes, use a mock user ID
      const userId = 'mock-user-id';
      
      return this.voiceDropsService.getVoiceDropsByRoom(roomId, query, userId);
    }
  
    @Get('single/:id')
    @ApiOperation({ summary: 'Get a specific voice drop' })
    @ApiResponse({
      status: 200,
      description: 'Voice drop retrieved successfully',
      type: VoiceDropResponseDto,
    })
    async getVoiceDropById(
      @Param('id', ParseUUIDPipe) id: string,
      // @GetUser('id') userId: string, // Comment out for now
    ): Promise<VoiceDropResponseDto> {
      // For testing purposes, use a mock user ID
      const userId = 'mock-user-id';
      
      return this.voiceDropsService.getVoiceDropById(id, userId);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a voice drop' })
    @ApiResponse({ status: 204, description: 'Voice drop deleted successfully' })
    async deleteVoiceDrop(
      @Param('id', ParseUUIDPipe) id: string,
      // @GetUser('id') userId: string, // Comment out for now
    ): Promise<void> {
      // For testing purposes, use a mock user ID
      const userId = 'mock-user-id';
      
      return this.voiceDropsService.deleteVoiceDrop(id, userId);
    }
  }
  