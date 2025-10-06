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
exports.NftTransferHistory = void 0;
const typeorm_1 = require("typeorm");
const nft_entity_1 = require("./nft.entity");
let NftTransferHistory = class NftTransferHistory {
    id;
    nftId;
    nft;
    fromAddress;
    toAddress;
    fromUserId;
    toUserId;
    transactionId;
    blockNumber;
    gasUsed;
    transferType;
    timestamp;
    metadata;
    createdAt;
};
exports.NftTransferHistory = NftTransferHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "nft_id" }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "nftId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nft_entity_1.Nft, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "nft_id" }),
    __metadata("design:type", nft_entity_1.Nft)
], NftTransferHistory.prototype, "nft", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_address" }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "fromAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_address" }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "toAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "from_user_id", nullable: true }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "to_user_id", nullable: true }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "toUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "transaction_id" }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "block_number", nullable: true }),
    __metadata("design:type", Number)
], NftTransferHistory.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "gas_used", nullable: true }),
    __metadata("design:type", Number)
], NftTransferHistory.prototype, "gasUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "transfer_type", type: "enum", enum: ["mint", "transfer", "burn"] }),
    __metadata("design:type", String)
], NftTransferHistory.prototype, "transferType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], NftTransferHistory.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], NftTransferHistory.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], NftTransferHistory.prototype, "createdAt", void 0);
exports.NftTransferHistory = NftTransferHistory = __decorate([
    (0, typeorm_1.Entity)("nft_transfer_history"),
    (0, typeorm_1.Index)(["nftId"]),
    (0, typeorm_1.Index)(["fromUserId"]),
    (0, typeorm_1.Index)(["toUserId"]),
    (0, typeorm_1.Index)(["transactionId"]),
    (0, typeorm_1.Index)(["timestamp"])
], NftTransferHistory);
//# sourceMappingURL=nft-transfer-history.entity.js.map