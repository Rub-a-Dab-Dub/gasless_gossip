import { GiftsService } from './gifts.service';
import { SendGiftDto } from './dto/send-gift.dto';
export declare class GiftsController {
    private readonly giftsService;
    constructor(giftsService: GiftsService);
    sendGift(req: any, dto: SendGiftDto): Promise<import("./entities/gift.entity").Gift>;
    getGifts(userId: string): Promise<import("./entities/gift.entity").Gift[]>;
}
