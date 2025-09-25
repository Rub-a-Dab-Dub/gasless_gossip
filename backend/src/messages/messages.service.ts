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

  async findAllByRoom(getMessagesDto: GetMessagesDto): Promise<PaginatedMessagesDto> {
    const { roomId, page = 1, limit = 20 } = getMessagesDto

    // Validate pagination parameters
    if (page < 1) {
      throw new BadRequestException("Page must be greater than 0")
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException("Limit must be between 1 and 100")
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Build the query with efficient PostgreSQL pagination
    const queryBuilder = this.messageRepository
      .createQueryBuilder("message")
      .where("message.roomId = :roomId", { roomId })
      .andWhere("message.isDeleted = :isDeleted", { isDeleted: false })
      .orderBy("message.createdAt", "DESC")
      .skip(offset)
      .take(limit)

    // Execute query and count total items efficiently
    const [messages, totalItems] = await queryBuilder.getManyAndCount()

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    const meta: PaginationMetaDto = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    }

    return {
      data: messages,
      meta,
    }
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id, isDeleted: false },
    })

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`)
    }

    return message
  }

  async update(id: string, updateData: Partial<CreateMessageDto>): Promise<Message> {
    const message = await this.findOne(id)

    Object.assign(message, updateData)
    return await this.messageRepository.save(message)
  }

  async remove(id: string): Promise<void> {
    const message = await this.findOne(id)

    // Soft delete by setting isDeleted flag
    message.isDeleted = true
    await this.messageRepository.save(message)
  }

  // Additional method for getting message count by room (useful for analytics)
  async getMessageCountByRoom(roomId: string): Promise<number> {
    return await this.messageRepository.count({
      where: { roomId, isDeleted: false },
    })
  }

  // Method to get recent messages with cursor-based pagination (alternative approach)
  async findRecentMessages(
    roomId: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ messages: Message[]; nextCursor?: string }> {
    const queryBuilder = this.messageRepository
      .createQueryBuilder("message")
      .where("message.roomId = :roomId", { roomId })
      .andWhere("message.isDeleted = :isDeleted", { isDeleted: false })
      .orderBy("message.createdAt", "DESC")
      .limit(limit + 1) // Get one extra to determine if there's a next page

    if (cursor) {
      queryBuilder.andWhere("message.createdAt < :cursor", { cursor })
    }

    const messages = await queryBuilder.getMany()

    let nextCursor: string | undefined
    if (messages.length > limit) {
      const lastMessage = messages.pop() // Remove the extra message
      nextCursor = lastMessage?.createdAt.toISOString()
    }

    return {
      messages,
      nextCursor,
    }
  }
}
