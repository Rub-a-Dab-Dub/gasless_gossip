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
var BlurredAvatarsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlurredAvatarsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blurred_avatar_entity_1 = require("./entities/blurred-avatar.entity");
const sharp = __importStar(require("sharp"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = require("@nestjs/config");
let BlurredAvatarsService = BlurredAvatarsService_1 = class BlurredAvatarsService {
    blurredAvatarRepository;
    configService;
    logger = new common_1.Logger(BlurredAvatarsService_1.name);
    uploadPath;
    constructor(blurredAvatarRepository, configService) {
        this.blurredAvatarRepository = blurredAvatarRepository;
        this.configService = configService;
        this.uploadPath = this.configService.get('UPLOAD_PATH', './uploads/blurred-avatars');
        this.ensureUploadDirectory();
    }
    ensureUploadDirectory() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }
    async createBlurredAvatar(createBlurredAvatarDto) {
        try {
            const existingAvatar = await this.blurredAvatarRepository.findOne({
                where: { userId: createBlurredAvatarDto.userId, isActive: true },
            });
            if (existingAvatar) {
                return this.updateBlurredAvatar(existingAvatar.id, {
                    blurLevel: createBlurredAvatarDto.blurLevel,
                    originalImageUrl: createBlurredAvatarDto.originalImageUrl,
                });
            }
            const blurredImageUrl = await this.processImage(createBlurredAvatarDto.originalImageUrl, createBlurredAvatarDto.blurLevel || 5, createBlurredAvatarDto.userId);
            const blurredAvatar = this.blurredAvatarRepository.create({
                ...createBlurredAvatarDto,
                imageUrl: blurredImageUrl,
            });
            const savedAvatar = await this.blurredAvatarRepository.save(blurredAvatar);
            this.logger.log(`Created blurred avatar for user ${createBlurredAvatarDto.userId}`);
            return savedAvatar;
        }
        catch (error) {
            this.logger.error(`Failed to create blurred avatar: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to create blurred avatar');
        }
    }
    async findAllByUserId(userId) {
        return this.blurredAvatarRepository.find({
            where: { userId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findLatestByUserId(userId) {
        return this.blurredAvatarRepository.findOne({
            where: { userId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async updateBlurredAvatar(id, updateBlurredAvatarDto) {
        const avatar = await this.blurredAvatarRepository.findOne({ where: { id } });
        if (!avatar) {
            throw new common_1.NotFoundException(`Blurred avatar with ID ${id} not found`);
        }
        if (updateBlurredAvatarDto.blurLevel && updateBlurredAvatarDto.blurLevel !== avatar.blurLevel) {
            const newBlurredImageUrl = await this.processImage(avatar.originalImageUrl, updateBlurredAvatarDto.blurLevel, avatar.userId);
            updateBlurredAvatarDto = { ...updateBlurredAvatarDto, imageUrl: newBlurredImageUrl };
        }
        Object.assign(avatar, updateBlurredAvatarDto);
        const updatedAvatar = await this.blurredAvatarRepository.save(avatar);
        this.logger.log(`Updated blurred avatar ${id}`);
        return updatedAvatar;
    }
    async remove(id) {
        const avatar = await this.blurredAvatarRepository.findOne({ where: { id } });
        if (!avatar) {
            throw new common_1.NotFoundException(`Blurred avatar with ID ${id} not found`);
        }
        avatar.isActive = false;
        await this.blurredAvatarRepository.save(avatar);
        this.logger.log(`Removed blurred avatar ${id}`);
    }
    async processImage(imageUrl, blurLevel, userId) {
        try {
            const filename = `${userId}_${Date.now()}_blur${blurLevel}.jpg`;
            const filepath = path.join(this.uploadPath, filename);
            let imageBuffer;
            if (imageUrl.startsWith('http')) {
                imageBuffer = Buffer.from('placeholder');
            }
            else {
                imageBuffer = fs.readFileSync(imageUrl);
            }
            const processedBuffer = await sharp(imageBuffer)
                .blur(blurLevel)
                .jpeg({ quality: 80 })
                .toBuffer();
            fs.writeFileSync(filepath, processedBuffer);
            const baseUrl = this.configService.get('BASE_URL', 'http://localhost:3001');
            return `${baseUrl}/uploads/blurred-avatars/${filename}`;
        }
        catch (error) {
            this.logger.error(`Failed to process image: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to process image');
        }
    }
    async getBlurredAvatarStats(userId) {
        const avatars = await this.findAllByUserId(userId);
        const latest = avatars[0];
        return {
            totalAvatars: avatars.length,
            latestBlurLevel: latest?.blurLevel || null,
            lastUpdated: latest?.updatedAt || null,
        };
    }
};
exports.BlurredAvatarsService = BlurredAvatarsService;
exports.BlurredAvatarsService = BlurredAvatarsService = BlurredAvatarsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blurred_avatar_entity_1.BlurredAvatar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], BlurredAvatarsService);
//# sourceMappingURL=blurred-avatars.service.js.map