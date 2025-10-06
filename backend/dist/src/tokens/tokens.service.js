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
var TokensService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const token_transaction_entity_1 = require("./token-transaction.entity");
const config_1 = require("@nestjs/config");
const stellar_account_entity_1 = require("../xp/stellar-account.entity");
const StellarSdk = require('stellar-sdk');
let TokensService = TokensService_1 = class TokensService {
    tokenTxRepo;
    stellarAccountRepo;
    config;
    logger = new common_1.Logger(TokensService_1.name);
    constructor(tokenTxRepo, stellarAccountRepo, config) {
        this.tokenTxRepo = tokenTxRepo;
        this.stellarAccountRepo = stellarAccountRepo;
        this.config = config;
    }
    async send(dto) {
        const horizon = this.config.get('STELLAR_HORIZON_URL') ||
            'https://horizon-testnet.stellar.org';
        const server = new StellarSdk.Server(horizon);
        const sourceSecret = this.config.get('STELLAR_SENDER_SECRET');
        if (!sourceSecret) {
            throw new Error('STELLAR_SENDER_SECRET not configured');
        }
        const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
        const sourcePublic = sourceKeypair.publicKey();
        let destination = dto.toId;
        if (!/^G[A-Z2-7]{55}$/.test(destination)) {
            const mapping = await this.stellarAccountRepo.findOne({
                where: { userId: destination },
            });
            if (!mapping) {
                throw new Error('Destination user has no linked Stellar account');
            }
            destination = mapping.stellarAccount;
        }
        const assetCode = this.config.get('STELLAR_ASSET_CODE');
        const assetIssuer = this.config.get('STELLAR_ASSET_ISSUER');
        const asset = assetCode && assetIssuer
            ? new StellarSdk.Asset(assetCode, assetIssuer)
            : StellarSdk.Asset.native();
        const account = await server.loadAccount(sourcePublic);
        const fee = await server.fetchBaseFee();
        const networkPassphrase = this.config.get('STELLAR_NETWORK_PASSPHRASE') ||
            StellarSdk.Networks.TESTNET;
        const tx = new StellarSdk.TransactionBuilder(account, {
            fee: fee.toString(),
            networkPassphrase,
        })
            .addOperation(StellarSdk.Operation.payment({
            destination,
            asset,
            amount: dto.amount,
        }))
            .setTimeout(60)
            .build();
        tx.sign(sourceKeypair);
        const result = await server.submitTransaction(tx);
        const logged = this.tokenTxRepo.create({
            fromId: dto.fromId,
            toId: dto.toId,
            amount: dto.amount,
            txId: result.hash,
        });
        await this.tokenTxRepo.save(logged);
        return { hash: result.hash, ledger: result.ledger, successful: true };
    }
    async history(userId) {
        return this.tokenTxRepo.find({
            where: [{ fromId: userId }, { toId: userId }],
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = TokensService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_transaction_entity_1.TokenTransaction)),
    __param(1, (0, typeorm_1.InjectRepository)(stellar_account_entity_1.StellarAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], TokensService);
//# sourceMappingURL=tokens.service.js.map