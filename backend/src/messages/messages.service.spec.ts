import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessagesService', () => {
  let service: MessagesService;
  let repo: Repository<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    repo = module.get<Repository<Message>>(getRepositoryToken(Message));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a message and return it', async () => {
    const dto: CreateMessageDto = {
      roomId: 'room1',
      content: 'hello world',
      senderId: 'user1',
    };
    const saved = {
      id: 'uuid',
      roomId: dto.roomId,
      contentHash: expect.any(String),
      senderId: dto.senderId,
      createdAt: expect.any(Date),
    };
    jest.spyOn(repo, 'create').mockReturnValue(saved as any);
    jest.spyOn(repo, 'save').mockResolvedValue(saved as any);
    const result = await service.create(dto);
    expect(result).toMatchObject(saved);
  });

  it('should find messages by room', async () => {
    const messages = [
      {
        id: '1',
        roomId: 'room1',
        contentHash: 'hash1',
        senderId: 'user1',
        createdAt: new Date(),
      },
      {
        id: '2',
        roomId: 'room1',
        contentHash: 'hash2',
        senderId: 'user2',
        createdAt: new Date(),
      },
    ];
    jest.spyOn(repo, 'find').mockResolvedValue(messages as any);
    const result = await service.findByRoom('room1');
    expect(result).toHaveLength(2);
    expect(result[0].roomId).toBe('room1');
  });
});
