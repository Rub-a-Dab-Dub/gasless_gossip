import { IsUUID, IsString, IsObject } from 'class-validator';

export class SendGiftDto {
  @IsUUID()
  recipientId!: string;

  @IsString()
  type!: string;

  @IsObject()
  metadata!: any;
}
