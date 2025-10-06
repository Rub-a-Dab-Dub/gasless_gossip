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
exports.DataEncryptionService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let DataEncryptionService = class DataEncryptionService {
    encryptionKey;
    hmacKey;
    constructor() {
        const enc = process.env.ENCRYPTION_KEY || '';
        const mac = process.env.HMAC_KEY || '';
        if (enc.length !== 64) {
            throw new Error('ENCRYPTION_KEY must be 64 hex chars (32 bytes)');
        }
        if (mac.length !== 64) {
            throw new Error('HMAC_KEY must be 64 hex chars (32 bytes)');
        }
        this.encryptionKey = Buffer.from(enc, 'hex');
        this.hmacKey = Buffer.from(mac, 'hex');
    }
    encrypt(plaintext, aad) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
        if (aad) {
            cipher.setAAD(Buffer.from(aad));
        }
        const ciphertext = Buffer.concat([
            cipher.update(Buffer.from(plaintext, 'utf8')),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();
        return {
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            ciphertext: ciphertext.toString('base64'),
        };
    }
    decrypt(data, aad) {
        const iv = Buffer.from(data.iv, 'base64');
        const authTag = Buffer.from(data.authTag, 'base64');
        const ciphertext = Buffer.from(data.ciphertext, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
        if (aad) {
            decipher.setAAD(Buffer.from(aad));
        }
        decipher.setAuthTag(authTag);
        const plaintext = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(),
        ]);
        return plaintext.toString('utf8');
    }
    computeSearchHash(value) {
        return crypto
            .createHmac('sha256', this.hmacKey)
            .update(value)
            .digest('hex');
    }
};
exports.DataEncryptionService = DataEncryptionService;
exports.DataEncryptionService = DataEncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DataEncryptionService);
//# sourceMappingURL=data-encryption.service.js.map