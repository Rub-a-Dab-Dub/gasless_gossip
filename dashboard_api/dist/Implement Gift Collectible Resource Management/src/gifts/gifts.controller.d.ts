import { GiftsService } from "./gifts.service";
import { CreateGiftDto } from "./dto/create-gift.dto";
import { UpdateGiftDto } from "./dto/update-gift.dto";
import { AssignGiftDto } from "./dto/assign-gift.dto";
import { GiftUserDto } from "./dto/gift-user.dto";
import { BattleRewardDto } from "./dto/battle-reward.dto";
export declare class GiftsController {
    private readonly giftsService;
    constructor(giftsService: GiftsService);
    mint(createGiftDto: CreateGiftDto): Promise<import("./entities/gift.entity").Gift>;
    findAll(type?: string, rarity?: string, isActive?: string): Promise<import("./entities/gift.entity").Gift[]>;
    getLowStockAlerts(): Promise<import("./entities/gift.entity").Gift[]>;
    getGiftingPatterns(giftId?: string): Promise<any>;
    getUserInventory(userId: string): Promise<import("./entities/user-gift.entity").UserGift[]>;
    findOne(id: string): Promise<import("./entities/gift.entity").Gift>;
    update(id: string, updateGiftDto: UpdateGiftDto): Promise<import("./entities/gift.entity").Gift>;
    assign(assignDto: AssignGiftDto): Promise<import("./entities/user-gift.entity").UserGift>;
    revoke(body: {
        userId: string;
        giftId: string;
        quantity: number;
    }): Promise<void>;
    giftToUser(giftDto: GiftUserDto): Promise<void>;
    battleReward(battleDto: BattleRewardDto): Promise<import("./entities/user-gift.entity").UserGift | null>;
    burn(id: string): Promise<void>;
}
