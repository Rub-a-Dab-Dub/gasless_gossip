import { IsUUID, IsISO8601, ValidateIf, IsInt, Min } from 'class-validator';

export class SetAutoDeleteDto {
  @IsUUID()
  messageId!: string;

  // Either provide absolute expiry or a relative seconds value
  @ValidateIf((o) => !o.seconds && !!o.expiry)
  @IsISO8601()
  expiry?: string;

  @ValidateIf((o) => !o.expiry && o.seconds !== undefined)
  @IsInt()
  @Min(1)
  seconds?: number;
}


