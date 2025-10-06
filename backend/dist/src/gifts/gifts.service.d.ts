import { Repository } from 'typeorm';
import { Gift } from './entities/gift.entity';
import { SendGiftDto } from './dto/send-gift.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class GiftsService {
    private readonly giftRepo;
    private readonly eventEmitter;
    private readonly logger;
    constructor(giftRepo: Repository<Gift>, eventEmitter: EventEmitter2);
    sendGift(senderId: string, dto: SendGiftDto): Promise<Gift>;
    getGiftsForUser(userId: string): Promise<Gift[]>;
}
