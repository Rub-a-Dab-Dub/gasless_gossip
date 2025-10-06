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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var IpfsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpfsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const FormData = __importStar(require("form-data"));
const axios_1 = __importDefault(require("axios"));
let IpfsService = IpfsService_1 = class IpfsService {
    configService;
    logger = new common_1.Logger(IpfsService_1.name);
    ipfsGateway;
    ipfsApiUrl;
    constructor(configService) {
        this.configService = configService;
        this.ipfsGateway = this.configService.get('IPFS_GATEWAY', 'https://ipfs.io/ipfs/');
        this.ipfsApiUrl = this.configService.get('IPFS_API_URL', 'https://api.pinata.cloud');
    }
    async uploadAudioFile(file) {
        try {
            if (!file.mimetype.startsWith('audio/')) {
                throw new common_1.BadRequestException('Only audio files are allowed');
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException('File size exceeds 10MB limit');
            }
            const formData = new FormData();
            formData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            const pinataApiKey = this.configService.get('PINATA_API_KEY');
            const pinataSecretKey = this.configService.get('PINATA_SECRET_KEY');
            if (!pinataApiKey || !pinataSecretKey) {
                return this.uploadToLocalIpfs(file);
            }
            const response = await axios_1.default.post(`${this.ipfsApiUrl}/pinning/pinFileToIPFS`, formData, {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretKey,
                },
            });
            const hash = response.data.IpfsHash;
            this.logger.log(`Audio file uploaded to IPFS: ${hash}`);
            return {
                hash,
                url: `${this.ipfsGateway}${hash}`,
                size: file.size,
            };
        }
        catch (error) {
            this.logger.error('Failed to upload to IPFS:', error);
            throw new common_1.BadRequestException('Failed to upload audio to IPFS');
        }
    }
    async uploadToLocalIpfs(file) {
        const localIpfsUrl = this.configService.get('LOCAL_IPFS_URL', 'http://localhost:5001');
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        const response = await axios_1.default.post(`${localIpfsUrl}/api/v0/add`, formData, {
            headers: formData.getHeaders(),
        });
        const hash = response.data.Hash;
        return {
            hash,
            url: `${this.ipfsGateway}${hash}`,
            size: file.size,
        };
    }
    getAudioUrl(hash) {
        return `${this.ipfsGateway}${hash}`;
    }
};
exports.IpfsService = IpfsService;
exports.IpfsService = IpfsService = IpfsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IpfsService);
//# sourceMappingURL=ipfs.service.js.map