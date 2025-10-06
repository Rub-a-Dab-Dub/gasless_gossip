import { Repository } from "typeorm";
import { Gift } from "./entities/gift.entity";
import { UserGift } from "./entities/user-gift.entity";
import { GiftTransaction } from "./entities/gift-transaction.entity";
import { CreateGiftDto } from "./dto/create-gift.dto";
import { UpdateGiftDto } from "./dto/update-gift.dto";
import { AssignGiftDto } from "./dto/assign-gift.dto";
import { GiftUserDto } from "./dto/gift-user.dto";
import { BattleRewardDto } from "./dto/battle-reward.dto";
export declare class GiftsService {
    private giftRepository;
    private userGiftRepository;
    private transactionRepository;
    constructor(giftRepository: Repository<Gift>, userGiftRepository: Repository<UserGift>, transactionRepository: Repository<GiftTransaction>);
    mintGift(createGiftDto: CreateGiftDto): Promise<Gift>;
    findAll(filters?: {
        type?: string;
        rarity?: string;
        isActive?: boolean;
    }): Promise<Gift[]>;
    findOne(id: string): Promise<Gift>;
    getUserInventory(userId: string): Promise<UserGift[]>;
    getGiftingPatterns(giftId?: string): Promise<any>;
    checkLowStockAlerts(): Promise<Gift[]>;
    assignGift(assignDto: AssignGiftDto, adminId: string): Promise<UserGift>;
    revokeGift(userId: string, giftId: string, quantity: number, adminId: string): Promise<void>;
    giftToUser(giftDto: GiftUserDto): Promise<void>;
    autoAwardBattleWinner(battleDto: BattleRewardDto): Promise<UserGift | null>;
    burnGift(id: string): Promise<void>;
    update(id: string, updateDto: UpdateGiftDto): Promise<Gift>;
    private groupBy;
}
