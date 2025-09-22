import { ApiProperty } from '@nestjs/swagger';

export class DropHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  recipients: string[];

  @ApiProperty()
  amount: number;

  @ApiProperty()
  txId: string;

  @ApiProperty()
  assetCode: string;

  @ApiProperty()
  assetIssuer: string;

  @ApiProperty()
  dropType: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  failureReason: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}