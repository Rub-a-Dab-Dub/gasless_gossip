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
var GatedRoomsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatedRoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gated_room_entity_1 = require("./entities/gated-room.entity");
const StellarSdk = __importStar(require("stellar-sdk"));
let GatedRoomsService = GatedRoomsService_1 = class GatedRoomsService {
    gatedRoomRepository;
    logger = new common_1.Logger(GatedRoomsService_1.name);
    server;
    constructor(gatedRoomRepository) {
        this.gatedRoomRepository = gatedRoomRepository;
        this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    }
    async createGatedRoom(createGatedRoomDto) {
        const gatedRoom = this.gatedRoomRepository.create(createGatedRoomDto);
        return await this.gatedRoomRepository.save(gatedRoom);
    }
    async findAll() {
        return await this.gatedRoomRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const gatedRoom = await this.gatedRoomRepository.findOne({
            where: { id, isActive: true },
        });
        if (!gatedRoom) {
            throw new common_1.NotFoundException(`Gated room with ID ${id} not found`);
        }
        return gatedRoom;
    }
    async findByRoomId(roomId) {
        return await this.gatedRoomRepository.findOne({
            where: { roomId, isActive: true },
        });
    }
    async checkAccess(checkAccessDto) {
        const { roomId, stellarAccountId } = checkAccessDto;
        const gatedRoom = await this.findByRoomId(roomId);
        if (!gatedRoom) {
            return {
                hasAccess: true,
                roomId,
                stellarAccountId,
                gateRules: [],
                verificationResults: [],
            };
        }
        const verificationResults = await Promise.all(gatedRoom.gateRules.map((rule) => this.verifyGateRule(stellarAccountId, rule)));
        const hasAccess = verificationResults.every((result) => result.passed);
        return {
            hasAccess,
            roomId,
            stellarAccountId,
            gateRules: gatedRoom.gateRules,
            verificationResults,
        };
    }
    async verifyGateRule(stellarAccountId, rule) {
        try {
            this.logger.log(`Verifying gate rule for account ${stellarAccountId}: ${JSON.stringify(rule)}`);
            const account = await this.server.loadAccount(stellarAccountId);
            if (rule.type === 'token') {
                return await this.verifyTokenHolding(account, rule);
            }
            else if (rule.type === 'nft') {
                return await this.verifyNftHolding(account, rule);
            }
            return {
                passed: false,
                rule,
                error: 'Unknown rule type',
            };
        }
        catch (error) {
            this.logger.error(`Error verifying gate rule: ${error.message}`);
            return {
                passed: false,
                rule,
                error: error.message,
            };
        }
    }
    async verifyTokenHolding(account, rule) {
        const balance = account.balances.find((b) => b.asset_type !== 'native' &&
            b.asset_code === rule.assetCode &&
            b.asset_issuer === rule.issuer);
        if (!balance) {
            return {
                passed: false,
                rule,
                error: 'Token not found in account',
                actualBalance: 0,
            };
        }
        const actualBalance = parseFloat(balance.balance);
        const requiredAmount = rule.minAmount || 1;
        const passed = actualBalance >= requiredAmount;
        return {
            passed,
            rule,
            actualBalance,
            requiredAmount,
            error: passed
                ? null
                : `Insufficient balance. Required: ${requiredAmount}, Actual: ${actualBalance}`,
        };
    }
    async verifyNftHolding(account, rule) {
        const nftBalance = account.balances.find((b) => b.asset_type !== 'native' &&
            b.asset_code === rule.assetCode &&
            b.asset_issuer === rule.issuer);
        if (!nftBalance) {
            return {
                passed: false,
                rule,
                error: 'NFT not found in account',
            };
        }
        const hasNft = parseFloat(nftBalance.balance) > 0;
        return {
            passed: hasNft,
            rule,
            balance: nftBalance.balance,
            error: hasNft ? null : 'NFT not owned by account',
        };
    }
    async deleteGatedRoom(id) {
        const gatedRoom = await this.findOne(id);
        gatedRoom.isActive = false;
        await this.gatedRoomRepository.save(gatedRoom);
    }
};
exports.GatedRoomsService = GatedRoomsService;
exports.GatedRoomsService = GatedRoomsService = GatedRoomsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gated_room_entity_1.GatedRoom)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GatedRoomsService);
//# sourceMappingURL=gated-rooms.service.js.map