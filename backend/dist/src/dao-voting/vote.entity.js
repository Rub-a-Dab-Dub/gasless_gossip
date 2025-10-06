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
exports.Vote = void 0;
const typeorm_1 = require("typeorm");
let Vote = class Vote {
    id;
    proposalId;
    userId;
    weight;
    choice;
    stellarTransactionHash;
    stellarAccountId;
    createdAt;
    updatedAt;
};
exports.Vote = Vote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Vote.prototype, "proposalId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Vote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 18, scale: 8 }),
    __metadata("design:type", Number)
], Vote.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20 }),
    __metadata("design:type", String)
], Vote.prototype, "choice", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 128, nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "stellarTransactionHash", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 56, nullable: true }),
    __metadata("design:type", String)
], Vote.prototype, "stellarAccountId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Vote.prototype, "updatedAt", void 0);
exports.Vote = Vote = __decorate([
    (0, typeorm_1.Entity)('votes'),
    (0, typeorm_1.Index)(['proposalId', 'userId'], { unique: true })
], Vote);
//# sourceMappingURL=vote.entity.js.map