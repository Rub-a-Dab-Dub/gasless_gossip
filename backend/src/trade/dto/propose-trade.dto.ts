import { IsUUID } from 'class-validator';

export class ProposeTradeDto {
  @IsUUID()
  offerId!: string;
}
