import { Controller, Sse, Query } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('events')
  sse(
    @Query('userId') userId?: string,
  ): Observable<{ data: unknown; type?: string; id?: string; retry?: number }> {
    return this.sseService.subscribeToEvents(userId);
  }
}
