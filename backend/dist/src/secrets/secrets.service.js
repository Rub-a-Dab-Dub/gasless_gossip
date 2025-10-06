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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const secret_entity_1 = require("./entities/secret.entity");
const crypto = __importStar(require("crypto"));
let SecretsService = class SecretsService {
    secretsRepository;
    constructor(secretsRepository) {
        this.secretsRepository = secretsRepository;
    }
    async createSecret(createSecretDto) {
        const contentHash = crypto
            .createHash('sha256')
            .update(createSecretDto.content + Date.now().toString())
            .digest('hex');
        const secret = this.secretsRepository.create({
            roomId: createSecretDto.roomId,
            contentHash,
            reactionCount: 0,
        });
        const savedSecret = await this.secretsRepository.save(secret);
        return this.toResponseDto(savedSecret);
    }
    async getTopSecrets(roomId, limit = 10) {
        const secrets = await this.secretsRepository.find({
            where: { roomId },
            order: { reactionCount: 'DESC', createdAt: 'DESC' },
            take: limit,
        });
        return secrets.map(secret => this.toResponseDto(secret));
    }
    async incrementReaction(secretId) {
        const secret = await this.secretsRepository.findOne({ where: { id: secretId } });
        if (!secret) {
            throw new common_1.NotFoundException('Secret not found');
        }
        secret.reactionCount += 1;
        const updatedSecret = await this.secretsRepository.save(secret);
        return this.toResponseDto(updatedSecret);
    }
    toResponseDto(secret) {
        return {
            id: secret.id,
            roomId: secret.roomId,
            contentHash: secret.contentHash,
            reactionCount: secret.reactionCount,
            createdAt: secret.createdAt,
        };
    }
};
exports.SecretsService = SecretsService;
exports.SecretsService = SecretsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(secret_entity_1.Secret)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SecretsService);
//# sourceMappingURL=secrets.service.js.map