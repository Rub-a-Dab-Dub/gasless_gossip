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
exports.StellarController = void 0;
const common_1 = require("@nestjs/common");
const stellar_service_1 = require("./stellar.service");
let StellarController = class StellarController {
    stellarService;
    constructor(stellarService) {
        this.stellarService = stellarService;
    }
    getStatus() {
        return this.stellarService.getStatus();
    }
    async getAccount(publicKey) {
        if (!publicKey) {
            return { error: 'Missing publicKey query param' };
        }
        try {
            const account = await this.stellarService.loadAccount(publicKey);
            return {
                publicKey: account.account_id,
                balances: account.balances,
                sequence: account.sequence,
                subentryCount: account.subentry_count,
            };
        }
        catch (err) {
            return { error: err.message };
        }
    }
    async getAccountBalance(publicKey, assetCode) {
        if (!publicKey) {
            return { error: 'Missing publicKey query param' };
        }
        try {
            const balance = await this.stellarService.getAccountBalance(publicKey, assetCode);
            return { balance, assetCode: assetCode || 'XLM' };
        }
        catch (err) {
            return { error: err.message };
        }
    }
    createKeypair() {
        return this.stellarService.createAccount();
    }
    async fundTestnetAccount(publicKey) {
        if (!publicKey) {
            return { error: 'Missing publicKey in request body' };
        }
        try {
            const success = await this.stellarService.fundTestnetAccount(publicKey);
            return { success, message: success ? 'Account funded successfully' : 'Failed to fund account' };
        }
        catch (err) {
            return { error: err.message };
        }
    }
    async sendPayment(body) {
        const { sourceSecretKey, destinationPublicKey, amount, memo } = body;
        if (!sourceSecretKey || !destinationPublicKey || !amount) {
            return { error: 'Missing required fields: sourceSecretKey, destinationPublicKey, amount' };
        }
        try {
            const result = await this.stellarService.sendPayment(sourceSecretKey, destinationPublicKey, amount, memo);
            return { success: true, transaction: result };
        }
        catch (err) {
            return { error: err.message };
        }
    }
    async testTransaction() {
        return this.stellarService.executeDummyTransaction();
    }
};
exports.StellarController = StellarController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StellarController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('account'),
    __param(0, (0, common_1.Query)('publicKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Get)('account/balance'),
    __param(0, (0, common_1.Query)('publicKey')),
    __param(1, (0, common_1.Query)('assetCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "getAccountBalance", null);
__decorate([
    (0, common_1.Get)('create-keypair'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StellarController.prototype, "createKeypair", null);
__decorate([
    (0, common_1.Post)('fund-testnet'),
    __param(0, (0, common_1.Body)('publicKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "fundTestnetAccount", null);
__decorate([
    (0, common_1.Post)('send-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "sendPayment", null);
__decorate([
    (0, common_1.Get)('test-transaction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StellarController.prototype, "testTransaction", null);
exports.StellarController = StellarController = __decorate([
    (0, common_1.Controller)('stellar'),
    __metadata("design:paramtypes", [stellar_service_1.StellarService])
], StellarController);
//# sourceMappingURL=stellar.controller.js.map