import { Controller, Get } from '@nestjs/common';
import { WebSocketsService } from './websockets.service';

@Controller('ws')
export class WebSocketsController {
  constructor(private readonly wsService: WebSocketsService) {}

  @Get('status')
  getStatus() {
    // For health check or connection status
    return { status: 'WebSocket server running' };
  }
}
