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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarService = void 0;
const common_1 = require("@nestjs/common");
const StellarSdk = __importStar(require("stellar-sdk"));
let StellarService = class StellarService {
    server;
    networkPassphrase;
    constructor() {
        this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
        this.networkPassphrase = StellarSdk.Networks.TESTNET;
    }
    async createEscrowAccount() {
        const escrowKeypair = StellarSdk.Keypair.random();
        return escrowKeypair.publicKey();
    }
    async processEscrowPayment(bidderId, escrowAccount, amount) {
        try {
            const transactionId = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`Processing escrow payment:`, {
                from: bidderId,
                to: escrowAccount,
                amount,
                transactionId,
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return transactionId;
        }
        catch (error) {
            throw new Error(`Failed to process Stellar payment: ${error.message}`);
        }
    }
    async refundBidder(escrowAccount, bidderId, amount, originalTxId) {
        try {
            console.log(`Refunding bidder:`, {
                from: escrowAccount,
                to: bidderId,
                amount,
                originalTxId,
            });
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        catch (error) {
            console.error(`Failed to refund bidder: ${error.message}`);
        }
    }
    async transferToGiftOwner(escrowAccount, giftId, amount) {
        try {
            console.log(`Transferring to gift owner:`, {
                from: escrowAccount,
                giftId,
                amount,
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        catch (error) {
            throw new Error(`Failed to transfer to gift owner: ${error.message}`);
        }
    }
    async transferGiftToWinner(giftId, winnerId) {
        try {
            console.log(`Transferring gift to winner:`, {
                giftId,
                winnerId,
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        catch (error) {
            throw new Error(`Failed to transfer gift to winner: ${error.message}`);
        }
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StellarService);
//# sourceMappingURL=stellar.service.js.map