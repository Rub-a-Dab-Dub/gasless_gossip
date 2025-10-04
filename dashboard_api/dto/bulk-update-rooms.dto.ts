import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateRoomDto } from './update-room.dto';

export class BulkUpdateRoomsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  roomIds: string[];

  @ApiProperty({ type: UpdateRoomDto })
  @ValidateNested()
  @Type(() => UpdateRoomDto)
  updates: UpdateRoomDto;
}