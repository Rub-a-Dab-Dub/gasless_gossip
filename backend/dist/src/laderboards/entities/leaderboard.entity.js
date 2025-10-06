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
exports.Leaderboard = exports.RankType = void 0;
const typeorm_1 = require("typeorm");
var RankType;
(function (RankType) {
    RankType["XP"] = "xp";
    RankType["TIPS"] = "tips";
    RankType["GIFTS"] = "gifts";
})(RankType || (exports.RankType = RankType = {}));
let Leaderboard = class Leaderboard {
    id;
    rankType;
    userId;
    score;
    createdAt;
    updatedAt;
};
exports.Leaderboard = Leaderboard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Leaderboard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RankType,
    }),
    __metadata("design:type", String)
], Leaderboard.prototype, "rankType", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Leaderboard.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('bigint'),
    __metadata("design:type", Number)
], Leaderboard.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Leaderboard.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Leaderboard.prototype, "updatedAt", void 0);
exports.Leaderboard = Leaderboard = __decorate([
    (0, typeorm_1.Entity)('leaderboards'),
    (0, typeorm_1.Index)(['rankType', 'score'], { name: 'idx_leaderboard_type_score' })
], Leaderboard);
//# sourceMappingURL=leaderboard.entity.js.map