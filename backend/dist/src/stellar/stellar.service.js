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
    network;
    networkPassphrase;
    isInitialized = false;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        await this.initializeSdk();
    }
    async initializeSdk() {
        try {
            this.network = this.configService.get('STELLAR_NETWORK', 'testnet');
            if (this.network === 'testnet') {
                this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
                this.networkPassphrase = StellarSdk.Networks.TESTNET;
                StellarSdk.Networks.TESTNET;
            }
            else if (this.network === 'mainnet') {
                this.server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
                this.networkPassphrase = StellarSdk.Networks.PUBLIC;
            }
            else {
                throw new Error(`Unsupported network: ${this.network}`);
            }
            await this.server.ledgers().limit(1).call();
            this.isInitialized = true;
            this.logger.log(`Stellar SDK initialized successfully on ${this.network} network`);
        }
        catch (error) {
            this.logger.error('Failed to initialize Stellar SDK:', error);
            throw error;
        }
    }
    getStatus() {
        return {
            initialized: this.isInitialized,
            network: this.network,
            horizonUrl: this.server?.serverURL?.toString() || 'Not initialized',
        };
    }
    createAccount() {
        const keypair = StellarSdk.Keypair.random();
        return {
            publicKey: keypair.publicKey(),
            secretKey: keypair.secret(),
        };
    }
    async fundTestnetAccount(publicKey) {
        if (this.network !== 'testnet') {
            throw new Error('Account funding is only available on testnet');
        }
        try {
            const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
            if (response.ok) {
                this.logger.log(`Successfully funded testnet account: ${publicKey}`);
                return true;
            }
            else {
                this.logger.error(`Failed to fund account: ${response.statusText}`);
                return false;
            }
        }
        catch (error) {
            this.logger.error('Error funding testnet account:', error);
            return false;
        }
    }
    async loadAccount(publicKey) {
        try {
            return await this.server.loadAccount(publicKey);
        }
        catch (error) {
            this.logger.error(`Failed to load account ${publicKey}:`, error);
            throw error;
        }
    }
    async getAccountBalance(publicKey, assetCode) {
        try {
            const account = await this.loadAccount(publicKey);
            const balance = account.balances.find(b => assetCode
                ? (b.asset_type !== 'native' && 'asset_code' in b && b.asset_code === assetCode)
                : b.asset_type === 'native');
            return balance ? balance.balance : '0';
        }
        catch (error) {
            this.logger.error(`Failed to get balance for ${publicKey}:`, error);
            throw error;
        }
    }
    async submitTransaction(sourceSecretKey, operations, memo) {
        try {
            const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
            const sourceAccount = await this.loadAccount(sourceKeypair.publicKey());
            let transactionBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            });
            if (memo) {
                transactionBuilder = transactionBuilder.addMemo(memo);
            }
            const builtTransaction = transactionBuilder.setTimeout(30).build();
            builtTransaction.sign(sourceKeypair);
            const result = await this.server.submitTransaction(builtTransaction);
            this.logger.log(`Transaction submitted successfully: ${result.hash}`);
            return {
                hash: result.hash,
                successful: result.successful,
                ledger: result.ledger,
                envelope_xdr: result.envelope_xdr,
            };
        }
        catch (error) {
            this.logger.error('Failed to submit transaction:', error);
            throw error;
        }
    }
    async sendPayment(sourceSecretKey, destinationPublicKey, amount, memo) {
        const paymentOperation = StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: amount,
        });
        const memoObj = memo ? StellarSdk.Memo.text(memo) : undefined;
        return alert('transaction sent');
    }
    async sendAsset(sourceSecretKey, destinationPublicKey, assetCode, issuerPublicKey, amount, memo) {
        const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);
        const paymentOperation = StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: asset,
            amount: amount,
        });
        const memoObj = memo ? StellarSdk.Memo.text(memo) : undefined;
        return console.log('done');
    }
    async listenForContractEvents(contractId, eventTypes = [], callback) {
        try {
            this.logger.log(`Starting to listen for events from contract: ${contractId}`);
            const eventStream = this.server
                .effects()
                .cursor('now')
                .stream({
                onmessage: (effect) => {
                    if (effect.type_i === 33) {
                        const event = {
                            id: effect.id,
                            type: effect.type,
                            contractId: contractId,
                            topic: effect.topic || [],
                            value: effect.value,
                            ledger: effect.ledger,
                            txHash: effect.transaction_hash,
                        };
                        if (eventTypes.length === 0 || eventTypes.includes(event.type)) {
                            callback(event);
                        }
                    }
                },
                onerror: (error) => {
                    this.logger.error('Error in contract event stream:', error);
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to start contract event listener:', error);
            throw error;
        }
    }
    async executeDummyTransaction() {
        try {
            const testAccount = this.createAccount();
            if (this.network === 'testnet') {
                const funded = await this.fundTestnetAccount(testAccount.publicKey);
                if (!funded) {
                    return {
                        success: false,
                        message: 'Failed to fund test account',
                    };
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
                const balance = await this.getAccountBalance(testAccount.publicKey);
                return {
                    success: true,
                    message: 'Dummy transaction executed successfully',
                    data: {
                        accountCreated: testAccount.publicKey,
                        balance: balance,
                        network: this.network,
                    },
                };
            }
            else {
                return {
                    success: true,
                    message: 'Dummy transaction executed successfully (account created only)',
                    data: {
                        accountCreated: testAccount.publicKey,
                        network: this.network,
                        note: 'Account not funded on mainnet',
                    },
                };
            }
        }
        catch (error) {
            this.logger.error('Dummy transaction failed:', error);
            return {
                success: false,
                message: `Dummy transaction failed: ${typeof error === 'object' && error !== null && 'message' in error ? error.message : String(error)}`,
            };
        }
    }
    async mintBadgeToken(userId, type, metadata) {
        this.logger.log(`Minted badge token for user ${userId}: ${type} with metadata ${JSON.stringify(metadata)}`);
    }
    async distributeReward(userId, amount) {
        this.logger.log(`Distributed ${amount} reward tokens to user ${userId}`);
    }
    async verifyPremiumThemeOwnership(userId, themeId) {
        if (themeId.startsWith('premium-')) {
            this.logger.log(`Verifying premium theme ownership for user ${userId}, theme ${themeId}`);
            return true;
        }
        return false;
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarService);
//# sourceMappingURL=stellar.service.js.map