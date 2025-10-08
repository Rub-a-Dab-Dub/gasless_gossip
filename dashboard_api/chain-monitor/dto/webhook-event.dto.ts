import { IsString, IsObject, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { EventType } from 'chain-monitor/interface';
export class WebhookEventDto {
    @IsString()
    eventId: string;

    @IsEnum(EventType)
    eventType: EventType;

    @IsString()
    chainId: string;

    @IsObject()
    payload: any;

    @IsOptional()
    @IsString()
    signature?: string;

    @IsNumber()
    timestamp: number;
}