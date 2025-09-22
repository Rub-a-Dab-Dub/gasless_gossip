import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketsService } from './websockets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message, Notification } from './websockets.entity';

describe('WebSocketsService', () => {
  let service: WebSocketsService;
  let messageRepo: any;
  let notificationRepo: any;

  beforeEach(async () => {
    messageRepo = { create: jest.fn(), save: jest.fn() };
    notificationRepo = { create: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebSocketsService,
        { provide: getRepositoryToken(Message), useValue: messageRepo },
        {
          provide: getRepositoryToken(Notification),
          useValue: notificationRepo,
        },
      ],
    }).compile();
    service = module.get<WebSocketsService>(WebSocketsService);
  });

  it('should save and broadcast chat message', async () => {
    const data = { roomId: '1', userId: '2', content: 'Hello' };
    const client = {
      broadcast: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
    };
    messageRepo.create.mockReturnValue(data);
    messageRepo.save.mockResolvedValue(data);
    const result = await service.handleChat(data, client as any);
    expect(messageRepo.create).toHaveBeenCalledWith(data);
    expect(messageRepo.save).toHaveBeenCalledWith(data);
    expect(client.broadcast.to).toHaveBeenCalledWith('1');
    expect(client.broadcast.emit).toHaveBeenCalledWith('chat', data);
    expect(result.status).toBe('sent');
  });

  it('should save and broadcast notification', async () => {
    const data = { userId: '2', content: 'Notify' };
    const client = { broadcast: { emit: jest.fn() } };
    notificationRepo.create.mockReturnValue(data);
    notificationRepo.save.mockResolvedValue(data);
    const result = await service.handleNotification(data, client as any);
    expect(notificationRepo.create).toHaveBeenCalledWith(data);
    expect(notificationRepo.save).toHaveBeenCalledWith(data);
    expect(client.broadcast.emit).toHaveBeenCalledWith('notification', data);
    expect(result.status).toBe('notified');
  });
});
