import { ApiProperty } from '@nestjs/swagger';

export class VoiceDropResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  audioHash: string;

  @ApiProperty()
  stellarHash: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  audioUrl: string;

  @ApiProperty()
  createdAt: Date;
}
