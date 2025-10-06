"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const bcrypt = __importStar(require("bcrypt"));
const ethers_1 = require("ethers");
const audit_log_entity_1 = require("../../audit-log/entities/audit-log.entity");
const pseudonym_entity_1 = require("../../pseudonym/entities/pseudonym.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const wallet_entity_1 = require("../../wallet/entities/wallet.entity");
let AdminUsersService = class AdminUsersService {
    userRepo;
    pseudonymRepo;
    walletRepo;
    auditLogRepo;
    cacheManager;
    provider;
    constructor(userRepo, pseudonymRepo, walletRepo, auditLogRepo, cacheManager) {
        this.userRepo = userRepo;
        this.pseudonymRepo = pseudonymRepo;
        this.walletRepo = walletRepo;
        this.auditLogRepo = auditLogRepo;
        this.cacheManager = cacheManager;
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    }
    async create(createUserDto, adminId) {
        const { username, email, password, bio, pseudonyms, walletAddress } = createUserDto;
        const existing = await this.userRepo.findOne({
            where: [{ username }, { email }],
        });
        if (existing) {
            throw new common_1.BadRequestException('Username or email already exists');
        }
        if (walletAddress && !ethers_1.ethers.isAddress(walletAddress)) {
            throw new common_1.BadRequestException('Invalid Ethereum wallet address');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({
            username,
            email,
            passwordHash,
            bio,
            lastActivityAt: new Date(),
        });
        const savedUser = await this.userRepo.save(user);
        if (pseudonyms && pseudonyms.length > 0) {
            const pseudonymEntities = pseudonyms.map((name) => this.pseudonymRepo.create({ name, user: savedUser }));
            await this.pseudonymRepo.save(pseudonymEntities);
        }
        if (walletAddress) {
            const balance = await this.getWalletBalance(walletAddress);
            const wallet = this.walletRepo.create({
                address: walletAddress,
                balance,
                user: savedUser,
                lastSyncedAt: new Date(),
            });
            await this.walletRepo.save(wallet);
        }
        await this.createAuditLog(savedUser.id, 'USER_CREATED', { username, email }, adminId);
        return this.findOne(savedUser.id);
    }
    async bulkCreate(bulkDto, adminId) {
        const results = { success: 0, failed: 0, errors: [] };
        for (const userDto of bulkDto.users) {
            try {
                await this.create(userDto, adminId);
                results.success++;
            }
            catch (error) {
                results.failed++;
                results.errors.push({
                    user: userDto.username,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        return results;
    }
    async findAll(query) {
        const cacheKey = `users:list:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const { page = 1, limit = 10, search, sortBy, sortOrder, ...filters } = query;
        const skip = (page - 1) * limit;
        const qb = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.pseudonyms', 'pseudonyms')
            .leftJoinAndSelect('user.wallet', 'wallet')
            .where('user.isDeleted = :isDeleted', { isDeleted: false });
        if (search) {
            qb.andWhere('(user.username LIKE :search OR user.email LIKE :search)', {
                search: `%${search}%`,
            });
        }
        if (filters.username) {
            qb.andWhere('user.username LIKE :username', { username: `%${filters.username}%` });
        }
        if (filters.email) {
            qb.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
        }
        if (filters.level !== undefined) {
            qb.andWhere('user.level = :level', { level: filters.level });
        }
        if (filters.minXp !== undefined) {
            qb.andWhere('user.xp >= :minXp', { minXp: filters.minXp });
        }
        if (filters.maxXp !== undefined) {
            qb.andWhere('user.xp <= :maxXp', { maxXp: filters.maxXp });
        }
        if (filters.lastActivityAfter) {
            qb.andWhere('user.lastActivityAt >= :lastActivityAfter', {
                lastActivityAfter: filters.lastActivityAfter,
            });
        }
        if (filters.walletAddress) {
            qb.andWhere('wallet.address = :walletAddress', {
                walletAddress: filters.walletAddress,
            });
        }
        if (filters.isVerified !== undefined) {
            qb.andWhere('user.isVerified = :isVerified', { isVerified: filters.isVerified });
        }
        if (filters.isSuspended !== undefined) {
            qb.andWhere('user.isSuspended = :isSuspended', { isSuspended: filters.isSuspended });
        }
        qb.orderBy(`user.${sortBy}`, sortOrder);
        const [users, total] = await qb.skip(skip).take(limit).getManyAndCount();
        const result = {
            data: users,
            meta: {
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
        await this.cacheManager.set(cacheKey, result, 300000);
        return result;
    }
    async findOne(id) {
        const cacheKey = `user:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const user = await this.userRepo.findOne({
            where: { id, isDeleted: false },
            relations: ['pseudonyms', 'wallet'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.wallet) {
            const balance = await this.getWalletBalance(user.wallet.address);
            user.wallet.balance = balance;
            user.wallet.lastSyncedAt = new Date();
            await this.walletRepo.save(user.wallet);
        }
        await this.cacheManager.set(cacheKey, user, 300000);
        return user;
    }
    async update(id, updateUserDto, adminId) {
        const user = await this.findOne(id);
        const changes = {};
        Object.keys(updateUserDto).forEach((key) => {
            const k = key;
            if (updateUserDto[k] !== undefined && user[k] !== updateUserDto[k]) {
                changes[k] = { from: user[k], to: updateUserDto[k] };
                if (k in user) {
                    user[k] = updateUserDto[k];
                }
            }
        });
        if (Object.keys(changes).length === 0) {
            return user;
        }
        await this.userRepo.save(user);
        await this.createAuditLog(user.id, 'USER_UPDATED', changes, adminId);
        await this.cacheManager.del(`user:${id}`);
        return this.findOne(id);
    }
    async softDelete(id, adminId) {
        const user = await this.findOne(id);
        user.isDeleted = true;
        user.deletedAt = new Date();
        await this.userRepo.save(user);
        await this.createAuditLog(user.id, 'USER_SOFT_DELETED', {}, adminId);
        await this.cacheManager.del(`user:${id}`);
    }
    async hardDelete(id, adminId) {
        const user = await this.findOne(id);
        await this.createAuditLog(user.id, 'USER_HARD_DELETED', { username: user.username }, adminId);
        await this.userRepo.remove(user);
        await this.cacheManager.del(`user:${id}`);
    }
    async getAuditLogs(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [logs, total] = await this.auditLogRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: logs,
            meta: {
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    async getWalletBalance(address) {
        try {
            const balance = await this.provider.getBalance(address);
            return ethers_1.ethers.formatEther(balance);
        }
        catch (error) {
            console.error(`Failed to fetch balance for ${address}:`, error);
            return '0';
        }
    }
    async createAuditLog(userId, action, changes, performedBy) {
        const log = this.auditLogRepo.create({
            userId,
            action,
            changes,
            performedBy,
        });
        await this.auditLogRepo.save(log);
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(pseudonym_entity_1.Pseudonym)),
    __param(2, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(3, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map