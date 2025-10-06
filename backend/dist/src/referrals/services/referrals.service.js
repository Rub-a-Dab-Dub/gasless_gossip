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
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const referral_entity_1 = require("../entities/referral.entity");
const stellar_service_1 = require("./stellar.service");
const crypto = __importStar(require("crypto"));
let ReferralsService = class ReferralsService {
    referralRepository;
    stellarService;
    constructor(referralRepository, stellarService) {
        this.referralRepository = referralRepository;
        this.stellarService = stellarService;
    }
    async generateReferralCode(userId) {
        let referralCode;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        while (!isUnique && attempts < maxAttempts) {
            referralCode = this.createReferralCode(userId);
            const existing = await this.referralRepository.findOne({
                where: { referralCode }
            });
            isUnique = !existing;
            attempts++;
        }
        if (!isUnique) {
            throw new Error('Could not generate unique referral code');
        }
        return referralCode;
    }
    createReferralCode(userId) {
        const hash = crypto.createHash('sha256').update(userId + Date.now()).digest('hex');
        return hash.substring(0, 8).toUpperCase();
    }
    async createReferral(createReferralDto) {
        const { referralCode, refereeId } = createReferralDto;
        const existingReferral = await this.referralRepository.findOne({
            where: { referralCode }
        });
        if (!existingReferral) {
            throw new common_1.NotFoundException('Invalid referral code');
        }
        const existingReferee = await this.referralRepository.findOne({
            where: { refereeId }
        });
        if (existingReferee) {
            throw new common_1.ConflictException('User has already been referred');
        }
        if (existingReferral.referrerId === refereeId) {
            throw new common_1.BadRequestException('Users cannot refer themselves');
        }
        const referral = this.referralRepository.create({
            referrerId: existingReferral.referrerId,
            refereeId,
            referralCode,
            reward: 10,
            status: referral_entity_1.ReferralStatus.PENDING
        });
        const savedReferral = await this.referralRepository.save(referral);
        this.processReward(savedReferral.id).catch(error => {
            console.error('Failed to process referral reward:', error);
        });
        return savedReferral;
    }
    async processReward(referralId) {
        const referral = await this.referralRepository.findOne({
            where: { id: referralId }
        });
        if (!referral)
            return;
        try {
            const userStellarPublicKey = await this.getUserStellarPublicKey(referral.referrerId);
            if (!userStellarPublicKey) {
                throw new Error('User does not have a Stellar account configured');
            }
            const result = await this.stellarService.distributeReward(userStellarPublicKey, referral.reward);
            if (result.success) {
                await this.referralRepository.update(referral.id, {
                    status: referral_entity_1.ReferralStatus.COMPLETED,
                    stellarTransactionId: result.transactionId,
                    completedAt: new Date()
                });
            }
            else {
                await this.referralRepository.update(referral.id, {
                    status: referral_entity_1.ReferralStatus.FAILED
                });
            }
        }
        catch (error) {
            await this.referralRepository.update(referral.id, {
                status: referral_entity_1.ReferralStatus.FAILED
            });
        }
    }
    async getUserStellarPublicKey(userId) {
        return process.env.STELLAR_TEST_PUBLIC_KEY || null;
    }
    async findReferralsByUser(userId) {
        return this.referralRepository.find({
            where: [
                { referrerId: userId },
                { refereeId: userId }
            ],
            order: { createdAt: 'DESC' }
        });
    }
    async getReferralStats(userId) {
        const referrals = await this.referralRepository.find({
            where: { referrerId: userId }
        });
        const totalReferrals = referrals.length;
        const completedReferrals = referrals.filter(r => r.status === referral_entity_1.ReferralStatus.COMPLETED).length;
        const pendingReferrals = referrals.filter(r => r.status === referral_entity_1.ReferralStatus.PENDING).length;
        const totalRewards = referrals
            .filter(r => r.status === referral_entity_1.ReferralStatus.COMPLETED)
            .reduce((sum, r) => sum + Number(r.reward), 0);
        return {
            totalReferrals,
            completedReferrals,
            pendingReferrals,
            totalRewards,
            referrals
        };
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(referral_entity_1.Referral)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map