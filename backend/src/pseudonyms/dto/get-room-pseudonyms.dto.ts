import { IsUUID } from 'class-validator';

export class GetRoomPseudonymsParamsDto {
  @IsUUID()
  roomId!: string;
}


