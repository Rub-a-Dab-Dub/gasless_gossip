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
var StellarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const StellarSdk = __importStar(require("stellar-sdk"));
let StellarService = StellarService_1 = class StellarService {
    configService;
    logger = new common_1.Logger(StellarService_1.name);
    server;
    rewardConfig;
    constructor(configService) {
        this.configService = configService;
        const isTestnet = this.configService.get('STELLAR_TESTNET', true);
        this.server = new StellarSdk.Server(isTestnet
            ? 'https://horizon-testnet.stellar.org'
            : 'https://horizon.stellar.org');
        if (isTestnet) {
            StellarSdk.Networks.TESTNET;
        }
        else {
            StellarSdk.Networks.PUBLIC;
        }
        this.rewardConfig = {
            baseReward: this.configService.get('STELLAR_BASE_REWARD', 10),
            assetCode: this.configService.get('STELLAR_ASSET_CODE', 'WHISPER'),
            issuerPublicKey: this.configService.get('STELLAR_ISSUER_PUBLIC_KEY'),
            distributorSecretKey: this.configService.get('STELLAR_DISTRIBUTOR_SECRET_KEY'),
        };
    }
    async distributeReward(recipientPublicKey, amount = this.rewardConfig.baseReward) {
        try {
            const distributorKeypair = StellarSdk.Keypair.fromSecret(this.rewardConfig.distributorSecretKey);
            const distributorAccount = await this.server.loadAccount(distributorKeypair.publicKey());
            const asset = this.rewardConfig.assetCode === 'XLM'
                ? StellarSdk.Asset.native()
                : new StellarSdk.Asset(this.rewardConfig.assetCode, this.rewardConfig.issuerPublicKey);
            const transaction = new StellarSdk.TransactionBuilder(distributorAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.configService.get('STELLAR_TESTNET', true)
                    ? StellarSdk.Networks.TESTNET
                    : StellarSdk.Networks.PUBLIC,
            })
                .addOperation(StellarSdk.Operation.payment({
                destination: recipientPublicKey,
                asset: asset,
                amount: amount.toString(),
            }))
                .addMemo(StellarSdk.Memo.text('Whisper Referral Reward'))
                .setTimeout(30)
                .build();
            transaction.sign(distributorKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`Stellar reward distributed: ${result.hash}`);
            return {
                success: true,
                transactionId: result.hash,
            };
        }
        catch (error) {
            this.logger.error('Failed to distribute Stellar reward', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async validateStellarAccount(publicKey) {
        try {
            await this.server.loadAccount(publicKey);
            return true;
        }
        catch (error) {
            this.logger.warn(`Invalid Stellar account: ${publicKey}`);
            return false;
        }
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarService);
//# sourceMappingURL=stellar.service.js.map