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
var StellarInvitationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarInvitationService = void 0;
const common_1 = require("@nestjs/common");
const stellar_sdk_1 = require("stellar-sdk");
let StellarInvitationService = StellarInvitationService_1 = class StellarInvitationService {
    configService;
    logger = new common_1.Logger(StellarInvitationService_1.name);
    server;
    sourceKeypair;
    networkPassphrase;
    constructor(configService) {
        this.configService = configService;
        const horizonUrl = this.configService.get("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org");
        const sourceSecret = this.configService.get("STELLAR_SOURCE_SECRET");
        this.networkPassphrase = this.configService.get("STELLAR_NETWORK_PASSPHRASE", stellar_sdk_1.Networks.TESTNET);
        if (!sourceSecret) {
            throw new Error("STELLAR_SOURCE_SECRET environment variable is required");
        }
        this.server = new stellar_sdk_1.Server(horizonUrl);
        this.sourceKeypair = stellar_sdk_1.Keypair.fromSecret(sourceSecret);
        this.logger.log(`Stellar service initialized with network: ${this.networkPassphrase}`);
    }
    async recordInvitationAcceptance(data) {
        try {
            this.logger.log(`Recording invitation acceptance on Stellar: ${data.invitationId}`);
            const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const contractData = this.encodeInvitationData(data);
            const transaction = new stellar_sdk_1.TransactionBuilder(sourceAccount, {
                fee: this.configService.get("STELLAR_BASE_FEE", stellar_sdk_1.BASE_FEE),
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(stellar_sdk_1.Operation.manageData({
                name: `invitation_${data.invitationId}`,
                value: contractData,
            }))
                .addOperation(stellar_sdk_1.Operation.manageData({
                name: `room_access_${data.roomId}_${data.inviteeId}`,
                value: Buffer.from(JSON.stringify({
                    invitationId: data.invitationId,
                    grantedAt: data.timestamp,
                    grantedBy: data.inviterId,
                })),
            }))
                .setTimeout(this.configService.get("STELLAR_TIMEOUT", 30))
                .build();
            transaction.sign(this.sourceKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`Invitation acceptance recorded successfully: ${result.hash}`);
            return result.hash;
        }
        catch (error) {
            this.logger.error(`Failed to record invitation acceptance: ${error.message}`, error.stack);
            throw new Error(`Stellar transaction failed: ${error.message}`);
        }
    }
    async verifyInvitationOnChain(invitationId) {
        try {
            this.logger.log(`Verifying invitation on-chain: ${invitationId}`);
            const account = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const dataKey = `invitation_${invitationId}`;
            const dataEntry = account.data_attr[dataKey];
            if (!dataEntry) {
                this.logger.warn(`Invitation not found on-chain: ${invitationId}`);
                return null;
            }
            const decodedData = this.decodeInvitationData(dataEntry);
            this.logger.log(`Invitation verified on-chain: ${invitationId}`);
            return decodedData;
        }
        catch (error) {
            this.logger.error(`Failed to verify invitation on-chain: ${error.message}`, error.stack);
            return null;
        }
    }
    async verifyRoomAccess(roomId, userId) {
        try {
            this.logger.log(`Verifying room access on-chain: ${roomId} for user ${userId}`);
            const account = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const dataKey = `room_access_${roomId}_${userId}`;
            const dataEntry = account.data_attr[dataKey];
            if (!dataEntry) {
                this.logger.warn(`Room access not found on-chain: ${roomId} for user ${userId}`);
                return false;
            }
            const accessData = JSON.parse(Buffer.from(dataEntry, "base64").toString());
            this.logger.log(`Room access verified on-chain: ${roomId} for user ${userId}`, accessData);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to verify room access on-chain: ${error.message}`, error.stack);
            return false;
        }
    }
    async revokeInvitationOnChain(invitationId) {
        try {
            this.logger.log(`Revoking invitation on-chain: ${invitationId}`);
            const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey());
            const transaction = new stellar_sdk_1.TransactionBuilder(sourceAccount, {
                fee: this.configService.get("STELLAR_BASE_FEE", stellar_sdk_1.BASE_FEE),
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(stellar_sdk_1.Operation.manageData({
                name: `invitation_${invitationId}`,
                value: null,
            }))
                .addOperation(stellar_sdk_1.Operation.manageData({
                name: `invitation_revoked_${invitationId}`,
                value: Buffer.from(JSON.stringify({
                    revokedAt: Date.now(),
                    reason: "invitation_revoked",
                })),
            }))
                .setTimeout(this.configService.get("STELLAR_TIMEOUT", 30))
                .build();
            transaction.sign(this.sourceKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`Invitation revoked on-chain successfully: ${result.hash}`);
            return result.hash;
        }
        catch (error) {
            this.logger.error(`Failed to revoke invitation on-chain: ${error.message}`, error.stack);
            throw new Error(`Stellar revocation failed: ${error.message}`);
        }
    }
    async getInvitationHistory(invitationId) {
        try {
            this.logger.log(`Getting invitation history from Stellar: ${invitationId}`);
            const transactions = await this.server
                .transactions()
                .forAccount(this.sourceKeypair.publicKey())
                .order("desc")
                .limit(100)
                .call();
            const invitationTxs = [];
            for (const tx of transactions.records) {
                const operations = await tx.operations();
                for (const op of operations.records) {
                    if (op.type === "manage_data" &&
                        (op.name === `invitation_${invitationId}` || op.name === `invitation_revoked_${invitationId}`)) {
                        invitationTxs.push({
                            hash: tx.hash,
                            timestamp: tx.created_at,
                            operation: op.name,
                            value: op.value,
                        });
                    }
                }
            }
            this.logger.log(`Found ${invitationTxs.length} transactions for invitation: ${invitationId}`);
            return invitationTxs;
        }
        catch (error) {
            this.logger.error(`Failed to get invitation history: ${error.message}`, error.stack);
            return [];
        }
    }
    encodeInvitationData(data) {
        const contractData = {
            invitationId: data.invitationId,
            roomId: data.roomId,
            inviterId: data.inviterId,
            inviteeId: data.inviteeId,
            code: data.code,
            timestamp: data.timestamp,
            version: "1.0",
        };
        return Buffer.from(JSON.stringify(contractData));
    }
    decodeInvitationData(encodedData) {
        const buffer = Buffer.from(encodedData, "base64");
        const data = JSON.parse(buffer.toString());
        return {
            invitationId: data.invitationId,
            roomId: data.roomId,
            inviterId: data.inviterId,
            inviteeId: data.inviteeId,
            code: data.code,
            timestamp: data.timestamp,
        };
    }
    async getAccountBalance() {
        try {
            const account = await this.server.loadAccount(this.sourceKeypair.publicKey());
            return account.balances.map((balance) => ({
                balance: balance.balance,
                asset: balance.asset_type === "native" ? "XLM" : `${balance.asset_code}:${balance.asset_issuer}`,
            }));
        }
        catch (error) {
            this.logger.error(`Failed to get account balance: ${error.message}`);
            return [];
        }
    }
    async healthCheck() {
        try {
            const account = await this.server.loadAccount(this.sourceKeypair.publicKey());
            return {
                status: "healthy",
                network: this.networkPassphrase,
                account: this.sourceKeypair.publicKey(),
            };
        }
        catch (error) {
            this.logger.error(`Stellar health check failed: ${error.message}`);
            return {
                status: "unhealthy",
                network: this.networkPassphrase,
                account: this.sourceKeypair.publicKey(),
            };
        }
    }
};
exports.StellarInvitationService = StellarInvitationService;
exports.StellarInvitationService = StellarInvitationService = StellarInvitationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], StellarInvitationService);
//# sourceMappingURL=stellar-invitation.service.js.map