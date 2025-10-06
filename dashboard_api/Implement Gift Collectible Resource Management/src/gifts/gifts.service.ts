import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual } from "typeorm";
import { Gift } from "./entities/gift.entity";
import { UserGift } from "./entities/user-gift.entity";
import {
  GiftTransaction,
  TransactionType,
} from "./entities/gift-transaction.entity";
import { CreateGiftDto } from "./dto/create-gift.dto";
import { UpdateGiftDto } from "./dto/update-gift.dto";
import { AssignGiftDto } from "./dto/assign-gift.dto";
import { GiftUserDto } from "./dto/gift-user.dto";
import { BattleRewardDto } from "./dto/battle-reward.dto";

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    @InjectRepository(UserGift)
    private userGiftRepository: Repository<UserGift>,
    @InjectRepository(GiftTransaction)
    private transactionRepository: Repository<GiftTransaction>
  ) {}

  // ========== MINT (Create) ==========
  async mintGift(createGiftDto: CreateGiftDto): Promise<Gift> {
    const existing = await this.giftRepository.findOne({
      where: { name: createGiftDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Gift with name "${createGiftDto.name}" already exists`
      );
    }

    const gift = this.giftRepository.create(createGiftDto);
    const saved = await this.giftRepository.save(gift);

    await this.transactionRepository.save({
      giftId: saved.id,
      type: TransactionType.MINT,
      quantity: 1,
      metadata: { adminId: "system" },
    });

    return saved;
  }

  // ========== READ ==========
  async findAll(filters?: {
    type?: string;
    rarity?: string;
    isActive?: boolean;
  }): Promise<Gift[]> {
    const query = this.giftRepository.createQueryBuilder("gift");

    if (filters?.type) {
      query.andWhere("gift.type = :type", { type: filters.type });
    }
    if (filters?.rarity) {
      query.andWhere("gift.rarity = :rarity", { rarity: filters.rarity });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere("gift.isActive = :isActive", {
        isActive: filters.isActive,
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Gift> {
    const gift = await this.giftRepository.findOne({ where: { id } });
    if (!gift) {
      throw new NotFoundException(`Gift #${id} not found`);
    }
    return gift;
  }

  async getUserInventory(userId: string): Promise<UserGift[]> {
    return this.userGiftRepository.find({
      where: { userId },
      relations: ["gift"],
      order: { acquiredAt: "DESC" },
    });
  }

  async getGiftingPatterns(giftId?: string): Promise<any> {
    const query = this.transactionRepository
      .createQueryBuilder("txn")
      .where("txn.type = :type", { type: TransactionType.GIFT });

    if (giftId) {
      query.andWhere("txn.giftId = :giftId", { giftId });
    }

    const transactions = await query
      .orderBy("txn.createdAt", "DESC")
      .take(100)
      .getMany();

    return {
      totalGifts: transactions.length,
      byGift: this.groupBy(transactions, "giftId"),
      recentActivity: transactions.slice(0, 20),
    };
  }

  async checkLowStockAlerts(): Promise<Gift[]> {
    const gifts = await this.giftRepository
      .createQueryBuilder("gift")
      .where("gift.maxSupply IS NOT NULL")
      .andWhere("gift.isActive = true")
      .getMany();

    return gifts.filter((gift) => {
      const remaining = gift.maxSupply - gift.totalMinted;
      const percentRemaining = (remaining / gift.maxSupply) * 100;
      return percentRemaining <= 10;
    });
  }

  // ========== UPDATE (Assign/Revoke) ==========
  async assignGift(
    assignDto: AssignGiftDto,
    adminId: string
  ): Promise<UserGift> {
    const gift = await this.findOne(assignDto.giftId);
    const quantity = assignDto.quantity || 1;

    // Check supply limits
    if (gift.maxSupply && gift.totalMinted + quantity > gift.maxSupply) {
      throw new BadRequestException("Insufficient supply for this gift");
    }

    let userGift = await this.userGiftRepository.findOne({
      where: { userId: assignDto.userId, giftId: assignDto.giftId },
    });

    if (userGift) {
      userGift.quantity += quantity;
    } else {
      userGift = this.userGiftRepository.create({
        userId: assignDto.userId,
        giftId: assignDto.giftId,
        quantity,
        acquiredFrom: "admin",
      });
    }

    gift.totalMinted += quantity;
    await this.giftRepository.save(gift);
    const saved = await this.userGiftRepository.save(userGift);

    await this.transactionRepository.save({
      giftId: assignDto.giftId,
      type: TransactionType.ADMIN_ASSIGN,
      toUserId: assignDto.userId,
      quantity,
      metadata: { adminId, reason: assignDto.reason },
    });

    return saved;
  }

  async revokeGift(
    userId: string,
    giftId: string,
    quantity: number,
    adminId: string
  ): Promise<void> {
    const userGift = await this.userGiftRepository.findOne({
      where: { userId, giftId },
    });

    if (!userGift || userGift.quantity < quantity) {
      throw new BadRequestException("User does not have enough of this gift");
    }

    userGift.quantity -= quantity;
    if (userGift.quantity === 0) {
      await this.userGiftRepository.remove(userGift);
    } else {
      await this.userGiftRepository.save(userGift);
    }

    await this.transactionRepository.save({
      giftId,
      type: TransactionType.ADMIN_REVOKE,
      fromUserId: userId,
      quantity,
      metadata: { adminId },
    });
  }

  async giftToUser(giftDto: GiftUserDto): Promise<void> {
    const quantity = giftDto.quantity || 1;

    // Validate ownership
    const fromUserGift = await this.userGiftRepository.findOne({
      where: { userId: giftDto.fromUserId, giftId: giftDto.giftId },
    });

    if (!fromUserGift || fromUserGift.quantity < quantity) {
      throw new BadRequestException("Insufficient quantity to gift");
    }

    // Deduct from sender
    fromUserGift.quantity -= quantity;
    if (fromUserGift.quantity === 0) {
      await this.userGiftRepository.remove(fromUserGift);
    } else {
      await this.userGiftRepository.save(fromUserGift);
    }

    // Add to receiver
    let toUserGift = await this.userGiftRepository.findOne({
      where: { userId: giftDto.toUserId, giftId: giftDto.giftId },
    });

    if (toUserGift) {
      toUserGift.quantity += quantity;
    } else {
      toUserGift = this.userGiftRepository.create({
        userId: giftDto.toUserId,
        giftId: giftDto.giftId,
        quantity,
        acquiredFrom: "gift",
        giftedByUserId: giftDto.fromUserId,
      });
    }

    await this.userGiftRepository.save(toUserGift);

    await this.transactionRepository.save({
      giftId: giftDto.giftId,
      type: TransactionType.GIFT,
      fromUserId: giftDto.fromUserId,
      toUserId: giftDto.toUserId,
      quantity,
      metadata: { roomId: giftDto.roomId, message: giftDto.message },
    });
  }

  async autoAwardBattleWinner(
    battleDto: BattleRewardDto
  ): Promise<UserGift | null> {
    const gift = await this.giftRepository.findOne({
      where: {
        isBattleReward: true,
        battleTier: LessThanOrEqual(battleDto.battleTier),
        isActive: true,
      },
      order: { battleTier: "DESC", rarity: "DESC" },
    });

    if (!gift) {
      return null; // No suitable battle reward found
    }

    // Check supply
    if (gift.maxSupply && gift.totalMinted >= gift.maxSupply) {
      return null;
    }

    let userGift = await this.userGiftRepository.findOne({
      where: { userId: battleDto.winnerId, giftId: gift.id },
    });

    if (userGift) {
      userGift.quantity += 1;
    } else {
      userGift = this.userGiftRepository.create({
        userId: battleDto.winnerId,
        giftId: gift.id,
        quantity: 1,
        acquiredFrom: "battle",
        battleId: battleDto.battleId,
      });
    }

    gift.totalMinted += 1;
    await this.giftRepository.save(gift);
    const saved = await this.userGiftRepository.save(userGift);

    await this.transactionRepository.save({
      giftId: gift.id,
      type: TransactionType.BATTLE_REWARD,
      toUserId: battleDto.winnerId,
      quantity: 1,
      metadata: { battleId: battleDto.battleId },
    });

    return saved;
  }

  // ========== DELETE (Burn) ==========
  async burnGift(id: string): Promise<void> {
    const gift = await this.findOne(id);

    await this.transactionRepository.save({
      giftId: id,
      type: TransactionType.BURN,
      quantity: 1,
      metadata: { adminId: "system" },
    });

    await this.giftRepository.remove(gift);
  }

  async update(id: string, updateDto: UpdateGiftDto): Promise<Gift> {
    const gift = await this.findOne(id);
    Object.assign(gift, updateDto);
    return this.giftRepository.save(gift);
  }

  // ========== HELPERS ==========
  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }
}
