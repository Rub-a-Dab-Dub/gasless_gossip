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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stellar_sdk_1 = require("stellar-sdk");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { username: createUserDto.username },
                { email: createUserDto.email },
            ],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        if (createUserDto.stellarAccountId) {
            this.validateStellarAccount(createUserDto.stellarAccountId);
        }
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find({
            where: { isActive: true },
            select: ['id', 'username', 'pseudonym', 'createdAt'],
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.username || updateUserDto.email) {
            const existingUser = await this.userRepository.findOne({
                where: [
                    { username: updateUserDto.username },
                    { email: updateUserDto.email },
                ],
            });
            if (existingUser && existingUser.id !== id) {
                throw new common_1.ConflictException('Username or email already exists');
            }
        }
        if (updateUserDto.stellarAccountId) {
            this.validateStellarAccount(updateUserDto.stellarAccountId);
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        user.isActive = false;
        await this.userRepository.save(user);
    }
    async linkStellarAccount(userId, stellarAccountId) {
        this.validateStellarAccount(stellarAccountId);
        const existingLink = await this.userRepository.findOne({
            where: { stellarAccountId },
        });
        if (existingLink && existingLink.id !== userId) {
            throw new common_1.ConflictException('Stellar account already linked to another user');
        }
        const user = await this.findOne(userId);
        user.stellarAccountId = stellarAccountId;
        return this.userRepository.save(user);
    }
    validateStellarAccount(stellarAccountId) {
        try {
            stellar_sdk_1.Keypair.fromPublicKey(stellarAccountId);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid Stellar account ID format');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map