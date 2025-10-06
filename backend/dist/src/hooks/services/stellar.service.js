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
var StellarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stellar_sdk_1 = require("stellar-sdk");
let StellarService = StellarService_1 = class StellarService {
    configService;
    logger = new common_1.Logger(StellarService_1.name);
    server;
    networkPassphrase;
    constructor(configService) {
        this.configService = configService;
        const horizonUrl = this.configService.get('STELLAR_HORIZON_URL');
        const network = this.configService.get('STELLAR_NETWORK');
        this.server = new stellar_sdk_1.Server(horizonUrl);
        this.networkPassphrase = network === 'testnet'
            ? stellar_sdk_1.Networks.TESTNET
            : stellar_sdk_1.Networks.PUBLIC;
        this.logger.log(`Stellar service initialized for ${network} network`);
    }
    async validateTransaction(transactionId) {
        try {
            const transaction = await this.server.transactions().transaction(transactionId).call();
            return transaction.successful;
        }
        catch (error) {
            this.logger.error(`Failed to validate transaction ${transactionId}: ${error.message}`);
            return false;
        }
    }
    async getAccountDetails(accountId) {
        try {
            const account = await this.server.loadAccount(accountId);
            return {
                id: account.id,
                sequence: account.sequence,
                balances: account.balances,
                signers: account.signers,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get account details for ${accountId}: ${error.message}`);
            throw error;
        }
    }
    async getTransactionDetails(transactionId) {
        try {
            const transaction = await this.server.transactions().transaction(transactionId).call();
            const operations = await this.server.operations().forTransaction(transactionId).call();
            return {
                id: transaction.id,
                hash: transaction.hash,
                successful: transaction.successful,
                ledger: transaction.ledger,
                createdAt: transaction.created_at,
                sourceAccount: transaction.source_account,
                operations: operations.records,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get transaction details for ${transactionId}: ${error.message}`);
            throw error;
        }
    }
    getNetworkPassphrase() {
        return this.networkPassphrase;
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarService);
//# sourceMappingURL=stellar.service.js.map