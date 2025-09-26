import {
  IsOptional,
  IsString,
  IsNumberString,
  IsIn,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetTokenLogsQueryDto {
  @IsOptional()
  @IsIn(['sent', 'received'])
  type?: 'sent' | 'received';

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
