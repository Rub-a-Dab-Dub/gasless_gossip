import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ArrayMinSize, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDropDto {
  @ApiProperty({
    description: 'Array of recipient wallet addresses',
    example: ['GCKFBEIYTKP633RJWBRR6F4ZCACDQY7CXMOJSM47MXXRX5QVYLZQ7JGD']
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({
    description: 'Amount of memecoins to drop per recipient',
    example: 100.5
  })
  @IsNumber()
  @Min(0.0000001)
  amount: number;

  @ApiProperty({
    description: 'Asset code for the memecoin',
    example: 'MEME',
    required: false
  })
  @IsOptional()
  @IsString()
  assetCode?: string;

  @ApiProperty({
    description: 'Type of drop',
    example: 'reward',
    required: false
  })
  @IsOptional()
  @IsEnum(['reward', 'airdrop', 'bonus'])
  dropType?: 'reward' | 'airdrop' | 'bonus';
}