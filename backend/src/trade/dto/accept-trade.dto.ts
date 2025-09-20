import { IsUUID } from 'class-validator';

export class AcceptTradeDto {
  @IsUUID()
  tradeId: string;

  @IsUUID()
  acceptorId: string;
}
