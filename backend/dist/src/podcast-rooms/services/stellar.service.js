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
var StellarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let StellarService = StellarService_1 = class StellarService {
    logger = new common_1.Logger(StellarService_1.name);
    async generateHash(data) {
        try {
            const hash = crypto
                .createHash('sha256')
                .update(data + process.env.STELLAR_SECRET || 'default-secret')
                .digest('hex');
            this.logger.log(`Generated Stellar hash: ${hash.substring(0, 10)}...`);
            return `stellar_${hash}`;
        }
        catch (error) {
            this.logger.error('Failed to generate Stellar hash', error);
            throw new Error('Stellar hash generation failed');
        }
    }
    async verifyHash(data, hash) {
        try {
            const expectedHash = await this.generateHash(data);
            return expectedHash === hash;
        }
        catch (error) {
            this.logger.error('Failed to verify Stellar hash', error);
            return false;
        }
    }
    async storeMetadata(metadata) {
        try {
            const metadataString = JSON.stringify(metadata);
            const txHash = await this.generateHash(metadataString);
            this.logger.log(`Stored metadata with transaction hash: ${txHash}`);
            return txHash;
        }
        catch (error) {
            this.logger.error('Failed to store metadata on Stellar', error);
            throw new Error('Stellar metadata storage failed');
        }
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)()
], StellarService);
//# sourceMappingURL=stellar.service.js.map