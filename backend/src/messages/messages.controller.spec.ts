import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: {
            create: jest.fn(),
            findByRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a message (with access)', async () => {
    const dto: CreateMessageDto = {
      roomId: 'room1',
      content: 'hi',
      senderId: 'user1',
    };
    const req = { user: { id: 'user1' } };
    const message: Message = {
      id: '1',
      roomId: 'room1',
      contentHash: 'hash',
      senderId: 'user1',
      createdAt: new Date(),
    };
    jest.spyOn(controller as any, 'userHasRoomAccess').mockReturnValue(true);
    jest.spyOn(service, 'create').mockResolvedValue(message);
    const result = await controller.create(dto, req);
    expect(result).toEqual(message);
  });

  it('should throw ForbiddenException if no access', async () => {
    const dto: CreateMessageDto = {
      roomId: 'room1',
      content: 'hi',
      senderId: 'user1',
    };
    const req = { user: { id: 'user1' } };
    jest.spyOn(controller as any, 'userHasRoomAccess').mockReturnValue(false);
    await expect(controller.create(dto, req)).rejects.toThrow(
      'No access to this room',
    );
  });

  it('should get messages by room (with access)', async () => {
    const req = { user: { id: 'user1' } };
    const messages: Message[] = [
      {
        id: '1',
        roomId: 'room1',
        contentHash: 'hash',
        senderId: 'user1',
        createdAt: new Date(),
      },
    ];
    jest.spyOn(controller as any, 'userHasRoomAccess').mockReturnValue(true);
    jest.spyOn(service, 'findByRoom').mockResolvedValue(messages);
    const result = await controller.findByRoom('room1', req);
    expect(result).toEqual(messages);
  });
});
