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
exports.NftCollection = void 0;
const typeorm_1 = require("typeorm");
const nft_entity_1 = require("./nft.entity");
let NftCollection = class NftCollection {
    id;
    name;
    symbol;
    description;
    metadata;
    contractAddress;
    creatorAddress;
    totalSupply;
    maxSupply;
    floorPrice;
    isVerified;
    nfts;
    createdAt;
    updatedAt;
};
exports.NftCollection = NftCollection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], NftCollection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], NftCollection.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], NftCollection.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], NftCollection.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb" }),
    __metadata("design:type", Object)
], NftCollection.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "contract_address", unique: true }),
    __metadata("design:type", String)
], NftCollection.prototype, "contractAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "creator_address" }),
    __metadata("design:type", String)
], NftCollection.prototype, "creatorAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_supply", default: 0 }),
    __metadata("design:type", Number)
], NftCollection.prototype, "totalSupply", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "max_supply", nullable: true }),
    __metadata("design:type", Number)
], NftCollection.prototype, "maxSupply", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "floor_price", type: "decimal", precision: 18, scale: 7, nullable: true }),
    __metadata("design:type", String)
], NftCollection.prototype, "floorPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "is_verified", default: false }),
    __metadata("design:type", Boolean)
], NftCollection.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => nft_entity_1.Nft, (nft) => nft.collectionId),
    __metadata("design:type", Array)
], NftCollection.prototype, "nfts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], NftCollection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], NftCollection.prototype, "updatedAt", void 0);
exports.NftCollection = NftCollection = __decorate([
    (0, typeorm_1.Entity)("nft_collections")
], NftCollection);
//# sourceMappingURL=nft-collection.entity.js.map