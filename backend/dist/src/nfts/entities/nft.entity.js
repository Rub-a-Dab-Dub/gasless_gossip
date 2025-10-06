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
exports.Nft = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Nft = class Nft {
    id;
    userId;
    user;
    metadata;
    txId;
    contractAddress;
    tokenId;
    stellarAssetCode;
    stellarAssetIssuer;
    transferLogs;
    mintPrice;
    currentOwner;
    rarityScore;
    collectionId;
    createdAt;
    updatedAt;
};
exports.Nft = Nft;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Nft.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id" }),
    __metadata("design:type", String)
], Nft.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Nft.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], Nft.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "tx_id", unique: true }),
    __metadata("design:type", String)
], Nft.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contract_address" }),
    __metadata("design:type", String)
], Nft.prototype, "contractAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "token_id" }),
    __metadata("design:type", String)
], Nft.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stellar_asset_code", nullable: true }),
    __metadata("design:type", String)
], Nft.prototype, "stellarAssetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stellar_asset_issuer", nullable: true }),
    __metadata("design:type", String)
], Nft.prototype, "stellarAssetIssuer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", name: "transfer_logs", default: "[]" }),
    __metadata("design:type", Array)
], Nft.prototype, "transferLogs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "mint_price", type: "decimal", precision: 18, scale: 7, nullable: true }),
    __metadata("design:type", String)
], Nft.prototype, "mintPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "current_owner", default: true }),
    __metadata("design:type", Boolean)
], Nft.prototype, "currentOwner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rarity_score", type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Nft.prototype, "rarityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "collection_id", nullable: true }),
    __metadata("design:type", String)
], Nft.prototype, "collectionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Nft.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Nft.prototype, "updatedAt", void 0);
exports.Nft = Nft = __decorate([
    (0, typeorm_1.Entity)("nfts"),
    (0, typeorm_1.Index)(["userId"]),
    (0, typeorm_1.Index)(["txId"]),
    (0, typeorm_1.Index)(["contractAddress", "tokenId"])
], Nft);
//# sourceMappingURL=nft.entity.js.map