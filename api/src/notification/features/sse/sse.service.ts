import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';

interface SseMessage {
  data: unknown;
  type?: string;
  id?: string;
  retry?: number;
}

@Injectable()
export class SseService implements OnModuleDestroy {
  private readonly stream$ = new Subject<SseMessage>();
  private readonly listeners: Array<{
    event: string;
    handler: (payload: unknown) => void;
  }> = [];
  private readonly userStreams = new Map<string, Subject<SseMessage>>();

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.registerListener('sse.payment.confirmed', (payload: any) => {
      const targetUser = payload?.user_id?.toString?.();
      if (targetUser) {
        this.publishToUser(targetUser, 'payment-confirmed', payload);
        return;
      }
      this.publishEvent('payment-confirmed', payload);
    });
    this.registerListener('sse.payment.backoffice', (payload) =>
      this.publishEvent('payment-backoffice', payload),
    );
  }

  subscribeToEvents(userId?: string): Observable<SseMessage> {
    if (userId) {
      return this.getUserStream(userId).asObservable();
    }
    return this.stream$.asObservable();
  }

  private publishEvent(type: string, data: unknown) {
    this.stream$.next({ type, data, id: `${type}:${Date.now()}` });
  }

  private publishToUser(userId: string, type: string, data: unknown) {
    this.getUserStream(userId).next({
      type,
      data,
      id: `${type}:${Date.now()}`,
    });
  }

  private getUserStream(userId: string): Subject<SseMessage> {
    if (!this.userStreams.has(userId)) {
      this.userStreams.set(userId, new Subject<SseMessage>());
    }
    return this.userStreams.get(userId)!;
  }

  private registerListener(event: string, handler: (payload: unknown) => void) {
    const boundHandler = handler.bind(this);
    this.eventEmitter.on(event, boundHandler);
    this.listeners.push({ event, handler: boundHandler });
  }

  onModuleDestroy() {
    this.listeners.forEach(({ event, handler }) =>
      this.eventEmitter.off(event, handler),
    );
    this.stream$.complete();
    this.userStreams.forEach((stream) => stream.complete());
    this.userStreams.clear();
  }
}
