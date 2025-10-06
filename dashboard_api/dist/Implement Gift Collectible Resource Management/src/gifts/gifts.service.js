"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gift_entity_1 = require("./entities/gift.entity");
const user_gift_entity_1 = require("./entities/user-gift.entity");
const gift_transaction_entity_1 = require("./entities/gift-transaction.entity");
let GiftsService = class GiftsService {
    giftRepository;
    userGiftRepository;
    transactionRepository;
    constructor(giftRepository, userGiftRepository, transactionRepository) {
        this.giftRepository = giftRepository;
        this.userGiftRepository = userGiftRepository;
        this.transactionRepository = transactionRepository;
    }
    async mintGift(createGiftDto) {
        const existing = await this.giftRepository.findOne({
            where: { name: createGiftDto.name },
        });
        if (existing) {
            throw new common_1.ConflictException(`Gift with name "${createGiftDto.name}" already exists`);
        }
        const gift = this.giftRepository.create(createGiftDto);
        const saved = await this.giftRepository.save(gift);
        await this.transactionRepository.save({
            giftId: saved.id,
            type: gift_transaction_entity_1.TransactionType.MINT,
            quantity: 1,
            metadata: { adminId: "system" },
        });
        return saved;
    }
    async findAll(filters) {
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
    async findOne(id) {
        const gift = await this.giftRepository.findOne({ where: { id } });
        if (!gift) {
            throw new common_1.NotFoundException(`Gift #${id} not found`);
        }
        return gift;
    }
    async getUserInventory(userId) {
        return this.userGiftRepository.find({
            where: { userId },
            relations: ["gift"],
            order: { acquiredAt: "DESC" },
        });
    }
    async getGiftingPatterns(giftId) {
        const query = this.transactionRepository
            .createQueryBuilder("txn")
            .where("txn.type = :type", { type: gift_transaction_entity_1.TransactionType.GIFT });
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
    async checkLowStockAlerts() {
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
    async assignGift(assignDto, adminId) {
        const gift = await this.findOne(assignDto.giftId);
        const quantity = assignDto.quantity || 1;
        if (gift.maxSupply && gift.totalMinted + quantity > gift.maxSupply) {
            throw new common_1.BadRequestException("Insufficient supply for this gift");
        }
        let userGift = await this.userGiftRepository.findOne({
            where: { userId: assignDto.userId, giftId: assignDto.giftId },
        });
        if (userGift) {
            userGift.quantity += quantity;
        }
        else {
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
            type: gift_transaction_entity_1.TransactionType.ADMIN_ASSIGN,
            toUserId: assignDto.userId,
            quantity,
            metadata: { adminId, reason: assignDto.reason },
        });
        return saved;
    }
    async revokeGift(userId, giftId, quantity, adminId) {
        const userGift = await this.userGiftRepository.findOne({
            where: { userId, giftId },
        });
        if (!userGift || userGift.quantity < quantity) {
            throw new common_1.BadRequestException("User does not have enough of this gift");
        }
        userGift.quantity -= quantity;
        if (userGift.quantity === 0) {
            await this.userGiftRepository.remove(userGift);
        }
        else {
            await this.userGiftRepository.save(userGift);
        }
        await this.transactionRepository.save({
            giftId,
            type: gift_transaction_entity_1.TransactionType.ADMIN_REVOKE,
            fromUserId: userId,
            quantity,
            metadata: { adminId },
        });
    }
    async giftToUser(giftDto) {
        const quantity = giftDto.quantity || 1;
        const fromUserGift = await this.userGiftRepository.findOne({
            where: { userId: giftDto.fromUserId, giftId: giftDto.giftId },
        });
        if (!fromUserGift || fromUserGift.quantity < quantity) {
            throw new common_1.BadRequestException("Insufficient quantity to gift");
        }
        fromUserGift.quantity -= quantity;
        if (fromUserGift.quantity === 0) {
            await this.userGiftRepository.remove(fromUserGift);
        }
        else {
            await this.userGiftRepository.save(fromUserGift);
        }
        let toUserGift = await this.userGiftRepository.findOne({
            where: { userId: giftDto.toUserId, giftId: giftDto.giftId },
        });
        if (toUserGift) {
            toUserGift.quantity += quantity;
        }
        else {
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
            type: gift_transaction_entity_1.TransactionType.GIFT,
            fromUserId: giftDto.fromUserId,
            toUserId: giftDto.toUserId,
            quantity,
            metadata: { roomId: giftDto.roomId, message: giftDto.message },
        });
    }
    async autoAwardBattleWinner(battleDto) {
        const gift = await this.giftRepository.findOne({
            where: {
                isBattleReward: true,
                battleTier: (0, typeorm_2.LessThanOrEqual)(battleDto.battleTier),
                isActive: true,
            },
            order: { battleTier: "DESC", rarity: "DESC" },
        });
        if (!gift) {
            return null;
        }
        if (gift.maxSupply && gift.totalMinted >= gift.maxSupply) {
            return null;
        }
        let userGift = await this.userGiftRepository.findOne({
            where: { userId: battleDto.winnerId, giftId: gift.id },
        });
        if (userGift) {
            userGift.quantity += 1;
        }
        else {
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
            type: gift_transaction_entity_1.TransactionType.BATTLE_REWARD,
            toUserId: battleDto.winnerId,
            quantity: 1,
            metadata: { battleId: battleDto.battleId },
        });
        return saved;
    }
    async burnGift(id) {
        const gift = await this.findOne(id);
        await this.transactionRepository.save({
            giftId: id,
            type: gift_transaction_entity_1.TransactionType.BURN,
            quantity: 1,
            metadata: { adminId: "system" },
        });
        await this.giftRepository.remove(gift);
    }
    async update(id, updateDto) {
        const gift = await this.findOne(id);
        Object.assign(gift, updateDto);
        return this.giftRepository.save(gift);
    }
    groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            result[group] = (result[group] || 0) + 1;
            return result;
        }, {});
    }
};
exports.GiftsService = GiftsService;
exports.GiftsService = GiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gift_entity_1.Gift)),
    __param(1, (0, typeorm_1.InjectRepository)(user_gift_entity_1.UserGift)),
    __param(2, (0, typeorm_1.InjectRepository)(gift_transaction_entity_1.GiftTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GiftsService);
//# sourceMappingURL=gifts.service.js.map