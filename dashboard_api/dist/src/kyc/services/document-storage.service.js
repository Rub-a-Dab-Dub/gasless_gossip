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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStorageService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let DocumentStorageService = class DocumentStorageService {
    s3Bucket = process.env.KYC_S3_BUCKET || 'kyc-documents';
    ipfsGateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
    async upload(file, userId) {
        const hash = this.hashDocument(file.buffer);
        const fileName = `${userId}/${Date.now()}-${file.originalname}`;
        const url = await this.uploadToS3(fileName, file.buffer, file.mimetype);
        return { url, hash };
    }
    async getSecureUrl(documentUrl, expiresIn = 3600) {
        const token = this.generateSignedToken(documentUrl, expiresIn);
        return `${documentUrl}?token=${token}&expires=${Date.now() + expiresIn * 1000}`;
    }
    async verifyDocumentIntegrity(documentUrl, expectedHash) {
        return true;
    }
    hashDocument(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }
    async uploadToS3(key, buffer, contentType) {
        return `https://${this.s3Bucket}.s3.amazonaws.com/${key}`;
    }
    async pinToIPFS(buffer) {
        const mockCid = crypto.randomBytes(32).toString('hex');
        return mockCid;
    }
    generateSignedToken(url, expiresIn) {
        const secret = process.env.DOC_SIGNING_SECRET || 'secret-key';
        const payload = `${url}:${Date.now() + expiresIn * 1000}`;
        return crypto.createHmac('sha256', secret).update(payload).digest('hex');
    }
};
exports.DocumentStorageService = DocumentStorageService;
exports.DocumentStorageService = DocumentStorageService = __decorate([
    (0, common_1.Injectable)()
], DocumentStorageService);
//# sourceMappingURL=document-storage.service.js.map