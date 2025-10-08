import { IsString, IsObject, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { EventType } from 'chain-monitor/interface';
export class EventFilterDto {
    @IsOptional()
    @IsEnum(EventType)
    eventType?: EventType;

    @IsOptional()
    @IsString()
    chainId?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    fromBlock?: number;

    @IsOptional()
    @IsNumber()
    toBlock?: number;

    @IsOptional()
    @IsNumber()
    minValue?: number;

    @IsOptional()
    @IsString()
    contractAddress?: string;
}