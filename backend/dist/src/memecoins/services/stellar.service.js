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
    issuerKeypair;
    distributorKeypair;
    constructor(configService) {
        this.configService = configService;
        const networkType = this.configService.get('STELLAR_NETWORK', 'testnet');
        this.server = networkType === 'mainnet'
            ? new StellarSdk.Server('https://horizon.stellar.org')
            : new StellarSdk.Server('https://horizon-testnet.stellar.org');
        if (networkType === 'mainnet') {
            StellarSdk.Networks.PUBLIC;
        }
        else {
            StellarSdk.Networks.TESTNET;
        }
        const issuerSecret = this.configService.get('STELLAR_ISSUER_SECRET');
        const distributorSecret = this.configService.get('STELLAR_DISTRIBUTOR_SECRET');
        if (!issuerSecret || !distributorSecret) {
            throw new Error('Stellar keypairs must be configured in environment variables');
        }
        this.issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecret);
        this.distributorKeypair = StellarSdk.Keypair.fromSecret(distributorSecret);
    }
    async createMemecoinAsset(assetCode) {
        try {
            return new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
        }
        catch (error) {
            this.logger.error(`Failed to create asset: ${error.message}`);
            throw new common_1.BadRequestException('Invalid asset parameters');
        }
    }
    async distributeToRecipients(recipients, amount, assetCode = 'MEME') {
        try {
            const asset = await this.createMemecoinAsset(assetCode);
            const distributorAccount = await this.server.loadAccount(this.distributorKeypair.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(distributorAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.configService.get('STELLAR_NETWORK') === 'mainnet'
                    ? StellarSdk.Networks.PUBLIC
                    : StellarSdk.Networks.TESTNET,
            });
            for (const recipient of recipients) {
                transaction.addOperation(StellarSdk.Operation.payment({
                    destination: recipient,
                    asset: asset,
                    amount: amount.toString(),
                }));
            }
            const builtTransaction = transaction.setTimeout(30).build();
            builtTransaction.sign(this.distributorKeypair);
            const result = await this.server.submitTransaction(builtTransaction);
            this.logger.log(`Successfully distributed ${amount} ${assetCode} to ${recipients.length} recipients`);
            return result.hash;
        }
        catch (error) {
            this.logger.error(`Distribution failed: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to distribute memecoins: ${error.message}`);
        }
    }
    async establishTrustline(userPublicKey, assetCode) {
        try {
            const asset = await this.createMemecoinAsset(assetCode);
            const userAccount = await this.server.loadAccount(userPublicKey);
            const transaction = new StellarSdk.TransactionBuilder(userAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.configService.get('STELLAR_NETWORK') === 'mainnet'
                    ? StellarSdk.Networks.PUBLIC
                    : StellarSdk.Networks.TESTNET,
            })
                .addOperation(StellarSdk.Operation.changeTrust({
                asset: asset,
            }))
                .setTimeout(30)
                .build();
            return transaction.toXDR();
        }
        catch (error) {
            this.logger.error(`Failed to establish trustline: ${error.message}`);
            throw new common_1.BadRequestException('Failed to establish trustline');
        }
    }
    getIssuerPublicKey() {
        return this.issuerKeypair.publicKey();
    }
    getDistributorPublicKey() {
        return this.distributorKeypair.publicKey();
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarService);
//# sourceMappingURL=stellar.service.js.map