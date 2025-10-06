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
var StellarBadgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarBadgeService = void 0;
const common_1 = require("@nestjs/common");
const StellarSdk = __importStar(require("stellar-sdk"));
const degen_badge_entity_1 = require("../entities/degen-badge.entity");
let StellarBadgeService = StellarBadgeService_1 = class StellarBadgeService {
    configService;
    logger = new common_1.Logger(StellarBadgeService_1.name);
    server;
    sourceKeypair;
    networkPassphrase;
    constructor(configService) {
        this.configService = configService;
        const horizonUrl = this.configService.get("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org");
        const sourceSecret = this.configService.get("STELLAR_SOURCE_SECRET");
        this.networkPassphrase = this.configService.get("STELLAR_NETWORK_PASSPHRASE", StellarSdk.Networks.TESTNET);
        this.server = new StellarSdk.Horizon.Server(horizonUrl);
        if (!sourceSecret) {
            throw new Error("STELLAR_SOURCE_SECRET environment variable is required");
        }
        this.sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
    }
    async mintBadgeToken(userId, badgeType, rewardAmount) {
        try {
            const assetCode = this.generateAssetCode(badgeType);
            const assetIssuer = this.sourceKeypair.publicKey();
            const badgeAsset = new StellarSdk.Asset(assetCode, assetIssuer);
            const userPublicKey = await this.getUserStellarAccount(userId);
            if (!userPublicKey) {
                throw new Error(`No Stellar account found for user ${userId}`);
            }
            const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: this.configService.get("STELLAR_BASE_FEE", "100"),
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(StellarSdk.Operation.payment({
                destination: userPublicKey,
                asset: badgeAsset,
                amount: rewardAmount.toString(),
            }))
                .addMemo(StellarSdk.Memo.text(`Degen Badge: ${badgeType}`))
                .setTimeout(this.configService.get("STELLAR_TIMEOUT", 180))
                .build();
            transaction.sign(this.sourceKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`Successfully minted ${assetCode} badge token for user ${userId}. TX: ${result.hash}`);
            return {
                transactionId: result.hash,
                assetCode,
                assetIssuer,
                amount: rewardAmount.toString(),
            };
        }
        catch (error) {
            this.logger.error(`Failed to mint badge token for user ${userId}:`, error);
            throw error;
        }
    }
    async createBadgeAsset(badgeType) {
        const assetCode = this.generateAssetCode(badgeType);
        const assetIssuer = this.sourceKeypair.publicKey();
        try {
            const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: this.configService.get("STELLAR_BASE_FEE", "100"),
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(StellarSdk.Operation.changeTrust({
                asset: new StellarSdk.Asset(assetCode, assetIssuer),
                limit: "1000000",
            }))
                .addMemo(StellarSdk.Memo.text(`Create Degen Badge Asset: ${badgeType}`))
                .setTimeout(this.configService.get("STELLAR_TIMEOUT", 180))
                .build();
            transaction.sign(this.sourceKeypair);
            await this.server.submitTransaction(transaction);
            this.logger.log(`Created badge asset ${assetCode} for ${badgeType}`);
            return new StellarSdk.Asset(assetCode, assetIssuer);
        }
        catch (error) {
            this.logger.error(`Failed to create badge asset for ${badgeType}:`, error);
            throw error;
        }
    }
    async getBadgeBalance(userPublicKey, badgeType) {
        try {
            const assetCode = this.generateAssetCode(badgeType);
            const assetIssuer = this.sourceKeypair.publicKey();
            const account = await this.server.loadAccount(userPublicKey);
            const balance = account.balances.find((balance) => balance.asset_type !== "native" && balance.asset_code === assetCode && balance.asset_issuer === assetIssuer);
            return balance ? balance.balance : "0";
        }
        catch (error) {
            this.logger.error(`Failed to get badge balance for user ${userPublicKey}:`, error);
            return "0";
        }
    }
    generateAssetCode(badgeType) {
        const assetCodes = {
            [degen_badge_entity_1.DegenBadgeType.HIGH_ROLLER]: "DGNHR",
            [degen_badge_entity_1.DegenBadgeType.RISK_TAKER]: "DGNRT",
            [degen_badge_entity_1.DegenBadgeType.STREAK_MASTER]: "DGNSM",
            [degen_badge_entity_1.DegenBadgeType.WHALE_HUNTER]: "DGNWH",
            [degen_badge_entity_1.DegenBadgeType.DIAMOND_HANDS]: "DGNDH",
            [degen_badge_entity_1.DegenBadgeType.DEGEN_LEGEND]: "DGNLG",
        };
        return assetCodes[badgeType];
    }
    async getUserStellarAccount(userId) {
        try {
            this.logger.warn(`getUserStellarAccount not fully implemented for user ${userId}`);
            return null;
        }
        catch (error) {
            this.logger.error(`Failed to get Stellar account for user ${userId}:`, error);
            return null;
        }
    }
};
exports.StellarBadgeService = StellarBadgeService;
exports.StellarBadgeService = StellarBadgeService = StellarBadgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], StellarBadgeService);
//# sourceMappingURL=stellar-badge.service.js.map