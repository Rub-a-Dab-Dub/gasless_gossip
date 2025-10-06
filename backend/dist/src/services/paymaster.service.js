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
var PaymasterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymasterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const account_1 = require("@biconomy/account");
const bundler_1 = require("@biconomy/bundler");
const ethers_1 = require("ethers");
const core_types_1 = require("@biconomy/core-types");
let PaymasterService = PaymasterService_1 = class PaymasterService {
    configService;
    logger = new common_1.Logger(PaymasterService_1.name);
    bundler;
    paymaster;
    provider;
    chainId;
    entryPointAddress;
    accountFactoryAddress;
    biconomyApiKey;
    paymasterApiKey;
    bundlerUrl;
    paymasterUrl;
    rpcUrl;
    isTestnet;
    rateLimitMap = new Map();
    maxUserOpsPerMinute = 100;
    constructor(configService) {
        this.configService = configService;
        this.isTestnet = this.configService.get('NODE_ENV') !== 'production';
        this.chainId = this.isTestnet ? core_types_1.ChainId.BASE_SEPOLIA_TESTNET : core_types_1.ChainId.BASE_MAINNET;
        this.rpcUrl = this.configService.get('BASE_RPC_URL', 'https://sepolia.base.org');
        this.biconomyApiKey = this.configService.get('BICONOMY_API_KEY');
        this.paymasterApiKey = this.configService.get('BICONOMY_PAYMASTER_API_KEY');
        if (!this.biconomyApiKey || !this.paymasterApiKey) {
            throw new Error('Biconomy API keys are required');
        }
        this.bundlerUrl = this.isTestnet
            ? `https://bundler.biconomy.io/api/v2/${this.chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`
            : `https://bundler.biconomy.io/api/v2/${this.chainId}/${this.biconomyApiKey}`;
        this.paymasterUrl = this.isTestnet
            ? `https://paymaster.biconomy.io/api/v2/${this.chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`
            : `https://paymaster.biconomy.io/api/v2/${this.chainId}/${this.paymasterApiKey}`;
        this.entryPointAddress = this.isTestnet
            ? '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
            : '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
        this.accountFactoryAddress = this.isTestnet
            ? '0x9406Cc1155c5fbe1f4A56D8D4d4C4Da4e4f4f4f4'
            : '0x9406Cc1155c5fbe1f4A56D8D4d4C4Da4e4f4f4f4';
        this.provider = new ethers_1.ethers.JsonRpcProvider(this.rpcUrl);
        this.bundler = new bundler_1.Bundler({
            bundlerUrl: this.bundlerUrl,
            chainId: this.chainId,
            entryPointAddress: this.entryPointAddress,
        });
        this.paymaster = new account_1.BiconomyPaymaster({
            paymasterUrl: this.paymasterUrl,
            strictMode: true,
        });
        this.logger.log(`PaymasterService initialized for ${this.isTestnet ? 'Base Sepolia' : 'Base Mainnet'} (Chain ID: ${this.chainId})`);
    }
    async createSmartAccount(privateKey) {
        try {
            const provider = new ethers_1.ethers.Wallet(privateKey, this.provider);
            const smartAccount = await (0, account_1.createSmartAccountClient)({
                signer: provider,
                bundlerUrl: this.bundlerUrl,
                paymasterUrl: this.paymasterUrl,
                entryPointAddress: this.entryPointAddress,
                chainId: this.chainId,
            });
            this.logger.log(`Smart account created: ${await smartAccount.getAccountAddress()}`);
            return smartAccount;
        }
        catch (error) {
            this.logger.error('Failed to create smart account:', error);
            throw new common_1.InternalServerErrorException('Failed to create smart account');
        }
    }
    async sponsorUserOperation(smartAccount, userOpRequest, userId) {
        try {
            if (!this.checkRateLimit(userId)) {
                throw new common_1.BadRequestException('Rate limit exceeded. Maximum 100 UserOps per minute.');
            }
            const userOp = await smartAccount.buildUserOperation([{
                    to: userOpRequest.to,
                    data: userOpRequest.data,
                    value: userOpRequest.value || '0',
                }]);
            if (userOpRequest.gasLimit) {
                userOp.callGasLimit = userOpRequest.gasLimit;
            }
            const biconomyPaymaster = smartAccount.paymaster;
            const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(userOp, account_1.PaymasterMode.SPONSORED);
            if (paymasterAndDataResponse) {
                userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
            }
            const userOpResponse = await smartAccount.sendUserOperation(userOp);
            this.logger.log(`UserOperation sent: ${userOpResponse.userOpHash}`);
            const transactionDetails = await userOpResponse.wait();
            this.logger.log(`UserOperation completed: ${transactionDetails.receipt.transactionHash}`);
            return {
                success: true,
                userOpHash: userOpResponse.userOpHash,
                txHash: transactionDetails.receipt.transactionHash,
                gasUsed: transactionDetails.receipt.gasUsed?.toString(),
                gasPrice: transactionDetails.receipt.gasPrice?.toString(),
            };
        }
        catch (error) {
            this.logger.error('Failed to sponsor UserOperation:', error);
            return {
                success: false,
                error: error.message || 'Unknown error occurred',
            };
        }
    }
    async sendGaslessChatMessage(smartAccount, messageData, roomId, userId) {
        try {
            const chatInterface = new ethers_1.ethers.Interface([
                'function sendMessage(string memory message, string memory roomId) external'
            ]);
            const data = chatInterface.encodeFunctionData('sendMessage', [messageData, roomId]);
            const chatContractAddress = this.isTestnet
                ? '0x1234567890123456789012345678901234567890'
                : '0x1234567890123456789012345678901234567890';
            return await this.sponsorUserOperation(smartAccount, {
                to: chatContractAddress,
                data: data,
                value: '0',
            }, userId);
        }
        catch (error) {
            this.logger.error('Failed to send gasless chat message:', error);
            return {
                success: false,
                error: error.message || 'Failed to send gasless chat message',
            };
        }
    }
    async submitGaslessIntent(smartAccount, intentData, intentType, userId) {
        try {
            const intentInterface = new ethers_1.ethers.Interface([
                'function submitIntent(string memory intentData, string memory intentType) external'
            ]);
            const data = intentInterface.encodeFunctionData('submitIntent', [intentData, intentType]);
            const intentContractAddress = this.isTestnet
                ? '0x2345678901234567890123456789012345678901'
                : '0x2345678901234567890123456789012345678901';
            return await this.sponsorUserOperation(smartAccount, {
                to: intentContractAddress,
                data: data,
                value: '0',
            }, userId);
        }
        catch (error) {
            this.logger.error('Failed to submit gasless intent:', error);
            return {
                success: false,
                error: error.message || 'Failed to submit gasless intent',
            };
        }
    }
    async getPaymasterStatus() {
        try {
            const balance = await this.provider.getBalance(this.paymasterUrl);
            return {
                isActive: true,
                balance: ethers_1.ethers.formatEther(balance),
                network: this.isTestnet ? 'base-sepolia' : 'base',
                chainId: Number(this.chainId),
                lastChecked: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Failed to get paymaster status:', error);
            return {
                isActive: false,
                balance: '0',
                network: this.isTestnet ? 'base-sepolia' : 'base',
                chainId: Number(this.chainId),
                lastChecked: new Date(),
            };
        }
    }
    async canSponsor() {
        try {
            const status = await this.getPaymasterStatus();
            return status.isActive && parseFloat(status.balance) > 0;
        }
        catch (error) {
            this.logger.error('Failed to check sponsorship capability:', error);
            return false;
        }
    }
    async estimateGas(userOpRequest) {
        try {
            return {
                callGasLimit: '100000',
                verificationGasLimit: '100000',
                preVerificationGas: '50000',
            };
        }
        catch (error) {
            this.logger.error('Failed to estimate gas:', error);
            throw new common_1.InternalServerErrorException('Failed to estimate gas');
        }
    }
    checkRateLimit(userId) {
        const now = Date.now();
        const userLimit = this.rateLimitMap.get(userId);
        if (!userLimit) {
            this.rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
            return true;
        }
        if (now > userLimit.resetTime) {
            this.rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
            return true;
        }
        if (userLimit.count >= this.maxUserOpsPerMinute) {
            return false;
        }
        userLimit.count++;
        return true;
    }
    getRateLimitStatus(userId) {
        const userLimit = this.rateLimitMap.get(userId);
        const now = Date.now();
        if (!userLimit || now > userLimit.resetTime) {
            return {
                remaining: this.maxUserOpsPerMinute,
                resetTime: now + 60000,
                limit: this.maxUserOpsPerMinute,
            };
        }
        return {
            remaining: Math.max(0, this.maxUserOpsPerMinute - userLimit.count),
            resetTime: userLimit.resetTime,
            limit: this.maxUserOpsPerMinute,
        };
    }
    cleanupRateLimits() {
        const now = Date.now();
        for (const [userId, limit] of this.rateLimitMap.entries()) {
            if (now > limit.resetTime) {
                this.rateLimitMap.delete(userId);
            }
        }
    }
};
exports.PaymasterService = PaymasterService;
exports.PaymasterService = PaymasterService = PaymasterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymasterService);
//# sourceMappingURL=paymaster.service.js.map