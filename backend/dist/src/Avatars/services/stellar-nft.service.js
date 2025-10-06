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
var StellarNftService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarNftService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stellar_sdk_1 = require("stellar-sdk");
let StellarNftService = StellarNftService_1 = class StellarNftService {
    configService;
    logger = new common_1.Logger(StellarNftService_1.name);
    server;
    issuerKeypair;
    networkPassphrase;
    constructor(configService) {
        this.configService = configService;
        const isTestnet = this.configService.get('STELLAR_NETWORK') === 'testnet';
        this.server = new stellar_sdk_1.Server(isTestnet
            ? 'https://horizon-testnet.stellar.org'
            : 'https://horizon.stellar.org');
        this.networkPassphrase = isTestnet ? stellar_sdk_1.Networks.TESTNET : stellar_sdk_1.Networks.PUBLIC;
        const issuerSecret = this.configService.get('STELLAR_ISSUER_SECRET');
        if (!issuerSecret) {
            throw new Error('STELLAR_ISSUER_SECRET is required');
        }
        this.issuerKeypair = stellar_sdk_1.Keypair.fromSecret(issuerSecret);
    }
    async mintNFT(recipientPublicKey, assetCode, metadata) {
        try {
            const issuerAccount = await this.server.loadAccount(this.issuerKeypair.publicKey());
            const nftAsset = new stellar_sdk_1.Asset(assetCode, this.issuerKeypair.publicKey());
            const transaction = new stellar_sdk_1.TransactionBuilder(issuerAccount, {
                fee: stellar_sdk_1.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(stellar_sdk_1.Operation.payment({
                destination: recipientPublicKey,
                asset: nftAsset,
                amount: '1',
            }))
                .addOperation(stellar_sdk_1.Operation.setOptions({
                source: this.issuerKeypair.publicKey(),
                masterWeight: 0,
            }))
                .addOperation(stellar_sdk_1.Operation.manageData({
                name: `${assetCode}_metadata`,
                value: JSON.stringify(metadata),
            }))
                .setTimeout(300)
                .build();
            transaction.sign(this.issuerKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`NFT minted successfully: ${result.hash}`);
            return {
                txId: result.hash,
                assetCode,
                issuer: this.issuerKeypair.publicKey(),
            };
        }
        catch (error) {
            this.logger.error('Error minting NFT:', error);
            throw new common_1.BadRequestException(`Failed to mint NFT: ${error.message}`);
        }
    }
    generateUniqueAssetCode(userId, level) {
        const timestamp = Date.now().toString(36);
        return `AVT${level}${userId.slice(-4)}${timestamp}`
            .toUpperCase()
            .slice(0, 12);
    }
};
exports.StellarNftService = StellarNftService;
exports.StellarNftService = StellarNftService = StellarNftService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarNftService);
//# sourceMappingURL=stellar-nft.service.js.map