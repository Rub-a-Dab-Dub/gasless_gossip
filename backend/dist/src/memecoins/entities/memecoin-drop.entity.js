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
exports.MemecoinDrop = void 0;
const typeorm_1 = require("typeorm");
let MemecoinDrop = class MemecoinDrop {
    id;
    recipients;
    amount;
    txId;
    assetCode;
    assetIssuer;
    dropType;
    status;
    failureReason;
    createdAt;
    updatedAt;
};
exports.MemecoinDrop = MemecoinDrop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true }),
    __metadata("design:type", Array)
], MemecoinDrop.prototype, "recipients", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 7 }),
    __metadata("design:type", Number)
], MemecoinDrop.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_id', nullable: true }),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_code', default: 'MEME' }),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "assetCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_issuer', nullable: true }),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "assetIssuer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drop_type', default: 'reward' }),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "dropType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failure_reason', nullable: true }),
    __metadata("design:type", String)
], MemecoinDrop.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MemecoinDrop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MemecoinDrop.prototype, "updatedAt", void 0);
exports.MemecoinDrop = MemecoinDrop = __decorate([
    (0, typeorm_1.Entity)('memecoin_drops')
], MemecoinDrop);
//# sourceMappingURL=memecoin-drop.entity.js.map