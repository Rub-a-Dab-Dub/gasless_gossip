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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Share = exports.Platform = exports.ContentType = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var ContentType;
(function (ContentType) {
    ContentType["SECRET"] = "secret";
    ContentType["GIFT"] = "gift";
    ContentType["ACHIEVEMENT"] = "achievement";
    ContentType["NFT"] = "nft";
    ContentType["LEVEL_UP"] = "level_up";
    ContentType["BADGE"] = "badge";
})(ContentType || (exports.ContentType = ContentType = {}));
var Platform;
(function (Platform) {
    Platform["TWITTER"] = "twitter";
    Platform["X"] = "x";
    Platform["FACEBOOK"] = "facebook";
    Platform["LINKEDIN"] = "linkedin";
    Platform["DISCORD"] = "discord";
    Platform["TELEGRAM"] = "telegram";
    Platform["REDDIT"] = "reddit";
    Platform["OTHER"] = "other";
})(Platform || (exports.Platform = Platform = {}));
let Share = class Share {
    id;
    userId;
    user;
    contentType;
    contentId;
    platform;
    shareUrl;
    externalUrl;
    shareText;
    metadata;
    xpAwarded;
    stellarTxId;
    isSuccessful;
    errorMessage;
    createdAt;
    updatedAt;
};
exports.Share = Share;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Share.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Share.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Share.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContentType,
        name: 'content_type',
    }),
    __metadata("design:type", String)
], Share.prototype, "contentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "contentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Platform,
    }),
    __metadata("design:type", String)
], Share.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'share_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "shareUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'external_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "externalUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'share_text', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "shareText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metadata', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Share.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'xp_awarded', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Share.prototype, "xpAwarded", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stellar_tx_id', type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "stellarTxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_successful', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Share.prototype, "isSuccessful", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Share.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Share.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Share.prototype, "updatedAt", void 0);
exports.Share = Share = __decorate([
    (0, typeorm_1.Entity)('shares'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['contentType', 'platform'])
], Share);
//# sourceMappingURL=share.entity.js.map