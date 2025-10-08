import { IsString, IsObject, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { EventType } from 'chain-monitor/interface';
export class AlertConfigDto {
    @IsString()
    name: string;

    @IsEnum(EventType)
    eventType: EventType;

    @IsObject()
    conditions: Record<string, any>;

    @IsString()
    @IsOptional()
    webhookUrl?: string;

    @IsOptional()
    channels?: string[];
}