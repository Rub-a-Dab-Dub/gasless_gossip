import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from './entities/gift.entity';
import { SendGiftDto } from './dto/send-gift.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GiftsService {
  private readonly logger = new Logger(GiftsService.name);

  constructor(
    @InjectRepository(Gift)
    private readonly giftRepo: Repository<Gift>,
    private readonly eventEmitter: EventEmitter2,
    // Inject StellarNftService or similar for tokenization
  ) {}

  async sendGift(senderId: string, dto: SendGiftDto): Promise<Gift> {
    // TODO: Mint/transfer on Stellar if needed, get txId
    const txId = null; // Replace with actual Stellar tx hash

    const gift = this.giftRepo.create(dto);
    const saved = await this.giftRepo.save(gift);

    // Emit animation event
    this.eventEmitter.emit('gift.sent', { senderId, ...saved });

    return saved;
  }

  async getGiftsForUser(userId: string): Promise<Gift[]> {
    return this.giftRepo.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
    });
  }
}
