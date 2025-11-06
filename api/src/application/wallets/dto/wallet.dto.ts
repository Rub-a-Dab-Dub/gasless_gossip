import { IsString, IsOptional } from 'class-validator';

export class SyncWalletBalanceDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  chain?: 'starknet' | 'base' | 'celo';
}
