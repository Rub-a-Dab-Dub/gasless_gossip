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
exports.TradesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trade_entity_1 = require("./entities/trade.entity");
const stellar_sdk_1 = require("stellar-sdk");
let TradesService = class TradesService {
    tradeRepo;
    server = new stellar_sdk_1.Server('https://horizon-testnet.stellar.org');
    issuerKeypair = stellar_sdk_1.Keypair.fromSecret(process.env.STELLAR_ISSUER_SECRET);
    constructor(tradeRepo) {
        this.tradeRepo = tradeRepo;
    }
    async proposeTrade(dto) {
        const trade = this.tradeRepo.create({
            offerId: dto.offerId,
        });
        return this.tradeRepo.save(trade);
    }
    async acceptTrade(dto) {
        const trade = await this.tradeRepo.findOne({ where: { id: dto.tradeId } });
        if (!trade)
            throw new common_1.NotFoundException('Trade not found');
        const account = await this.server.loadAccount(this.issuerKeypair.publicKey());
        const tx = new stellar_sdk_1.TransactionBuilder(account, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET,
        })
            .addOperation(stellar_sdk_1.Operation.payment({
            destination: dto.acceptorId,
            asset: undefined,
            amount: '1',
        }))
            .setTimeout(30)
            .build();
        tx.sign(this.issuerKeypair);
        const result = await this.server.submitTransaction(tx);
        trade.acceptorId = dto.acceptorId;
        trade.txId = result.hash;
        return this.tradeRepo.save(trade);
    }
};
exports.TradesService = TradesService;
exports.TradesService = TradesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trade_entity_1.Trade)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TradesService);
//# sourceMappingURL=trade.service.js.map