import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
// import IPFS and Stellar SDKs as needed

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    // 1. Store message content in IPFS, get hash
    // 2. Store hash on Stellar (pseudo)
    // 3. Save message in DB with hash
    // TODO: Implement IPFS and Stellar integration
    const contentHash = await this.hashMessageContent(createMessageDto.content);
    const message = this.messageRepository.create({
      roomId: createMessageDto.roomId,
      contentHash,
      senderId: createMessageDto.senderId,
    });
    return this.messageRepository.save(message);
  }

  async findByRoom(roomId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }

  private async hashMessageContent(content: string): Promise<string> {
    // TODO: Store content in IPFS and return hash
    // Placeholder: return a simple hash for now
    return (
      'QmFakeIpfsHashFor_' + Buffer.from(content).toString('hex').slice(0, 16)
    );
  }
}
