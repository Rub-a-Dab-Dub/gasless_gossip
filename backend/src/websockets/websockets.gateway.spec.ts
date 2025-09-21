import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketsGateway } from './websockets.gateway';
import { WebSocketsService } from './websockets.service';

describe('WebSocketsGateway', () => {
  let gateway: WebSocketsGateway;
  let service: WebSocketsService;

  beforeEach(async () => {
    service = { handleChat: jest.fn(), handleNotification: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebSocketsGateway,
        { provide: WebSocketsService, useValue: service },
      ],
    }).compile();
    gateway = module.get<WebSocketsGateway>(WebSocketsGateway);
  });

  it('should handle chat event', async () => {
    const data = { roomId: '1', userId: '2', content: 'Hello' };
    const client = {};
    (service.handleChat as jest.Mock).mockResolvedValue({ status: 'sent', message: data });
    const result = await gateway.handleChat(data, client as any);
    expect(service.handleChat).toHaveBeenCalledWith(data, client);
    expect(result.status).toBe('sent');
  });

  it('should handle notification event', async () => {
    const data = { userId: '2', content: 'Notify' };
    const client = {};
    (service.handleNotification as jest.Mock).mockResolvedValue({ status: 'notified', notification: data });
    const result = await gateway.handleNotification(data, client as any);
    expect(service.handleNotification).toHaveBeenCalledWith(data, client);
    expect(result.status).toBe('notified');
  });
});
