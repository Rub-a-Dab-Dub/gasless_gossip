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
const stellar_sdk_1 = require("stellar-sdk");
let StellarNftService = StellarNftService_1 = class StellarNftService {
    configService;
    logger = new common_1.Logger(StellarNftService_1.name);
    server;
    networkPassphrase;
    sourceKeypair;
    constructor(configService) {
        this.configService = configService;
        const horizonUrl = this.configService.get("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org");
        this.server = new stellar_sdk_1.Server(horizonUrl);
        this.networkPassphrase = this.configService.get("STELLAR_NETWORK_PASSPHRASE", stellar_sdk_1.Networks.TESTNET);
        const sourceSecret = this.configService.get("STELLAR_SOURCE_SECRET");
        if (!sourceSecret) {
            throw new Error("STELLAR_SOURCE_SECRET environment variable is required");
        }
        this.sourceKeypair = stellar_sdk_1.Keypair.fromSecret(sourceSecret);
    }
    async mintNft(recipientPublicKey, metadata, collectionSymbol = "WHISPER") {
        try {
            this.logger.log(`Minting NFT for recipient: ${recipientPublicKey}`);
            const assetCode = this.generateAssetCode(collectionSymbol);
            const asset = new stellar_sdk_1.Asset(assetCode, this.sourceKeypair.publicKey());
            const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const transaction = new stellar_sdk_1.TransactionBuilder(sourceAccount, {
                fee: stellar_sdk_1.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(stellar_sdk_1.Operation.changeTrust({
                asset: asset,
                source: recipientPublicKey,
            }))
                .addOperation(stellar_sdk_1.Operation.payment({
                destination: recipientPublicKey,
                asset: asset,
                amount: "1",
            }))
                .addOperation(stellar_sdk_1.Operation.manageData({
                name: `nft_metadata_${assetCode}`,
                value: JSON.stringify(metadata),
            }))
                .addOperation(stellar_sdk_1.Operation.setOptions({
                setFlags: 2,
            }))
                .setTimeout(300)
                .build();
            transaction.sign(this.sourceKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`NFT minted successfully. Transaction ID: ${result.hash}`);
            return {
                transactionId: result.hash,
                assetCode: assetCode,
                assetIssuer: this.sourceKeypair.publicKey(),
                contractAddress: this.sourceKeypair.publicKey(),
                tokenId: assetCode,
            };
        }
        catch (error) {
            this.logger.error(`Failed to mint NFT: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to mint NFT: ${error.message}`);
        }
    }
    async transferNft(fromPublicKey, toPublicKey, assetCode, assetIssuer) {
        try {
            this.logger.log(`Transferring NFT ${assetCode} from ${fromPublicKey} to ${toPublicKey}`);
            const asset = new stellar_sdk_1.Asset(assetCode, assetIssuer);
            const sourceAccount = await this.server.loadAccount(fromPublicKey);
            const transaction = new stellar_sdk_1.TransactionBuilder(sourceAccount, {
                fee: stellar_sdk_1.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(stellar_sdk_1.Operation.changeTrust({
                asset: asset,
                source: toPublicKey,
            }))
                .addOperation(stellar_sdk_1.Operation.payment({
                destination: toPublicKey,
                asset: asset,
                amount: "1",
                source: fromPublicKey,
            }))
                .setTimeout(300)
                .build();
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`NFT transferred successfully. Transaction ID: ${result.hash}`);
            return result.hash;
        }
        catch (error) {
            this.logger.error(`Failed to transfer NFT: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to transfer NFT: ${error.message}`);
        }
    }
    async getNftMetadata(assetCode, assetIssuer) {
        try {
            const account = await this.server.loadAccount(assetIssuer);
            const dataKey = `nft_metadata_${assetCode}`;
            if (account.data_attr && account.data_attr[dataKey]) {
                const metadataBuffer = Buffer.from(account.data_attr[dataKey], "base64");
                return JSON.parse(metadataBuffer.toString());
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Failed to get NFT metadata: ${error.message}`);
            return null;
        }
    }
    async verifyNftOwnership(publicKey, assetCode, assetIssuer) {
        try {
            const account = await this.server.loadAccount(publicKey);
            const asset = new stellar_sdk_1.Asset(assetCode, assetIssuer);
            const balance = account.balances.find((balance) => balance.asset_type !== "native" &&
                balance.asset_code === asset.getCode() &&
                balance.asset_issuer === asset.getIssuer());
            return balance && Number.parseFloat(balance.balance) >= 1;
        }
        catch (error) {
            this.logger.error(`Failed to verify NFT ownership: ${error.message}`);
            return false;
        }
    }
    generateAssetCode(collectionSymbol) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `${collectionSymbol}${timestamp}${random}`.substring(0, 12).toUpperCase();
    }
    async getTransactionDetails(transactionId) {
        try {
            return await this.server.transactions().transaction(transactionId).call();
        }
        catch (error) {
            this.logger.error(`Failed to get transaction details: ${error.message}`);
            return null;
        }
    }
};
exports.StellarNftService = StellarNftService;
exports.StellarNftService = StellarNftService = StellarNftService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], StellarNftService);
//# sourceMappingURL=stellar-nft.service.js.map