import { IsUUID, IsNotEmpty, IsNumber, Min, Max, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoiceDropDto {
  @ApiProperty({ description: 'Room ID where the voice note will be shared' })
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'Duration in seconds', minimum: 1, maximum: 300 })
  @IsNumber()
  @Min(1)
  @Max(300) // 5 minutes max
  duration: number;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  @Min(1)
  fileSize: number;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'MIME type', example: 'audio/mpeg' })
  @IsString()
  @Matches(/^audio\/(mpeg|wav|ogg|mp4|webm|aac)$/)
  mimeType: string;
}
