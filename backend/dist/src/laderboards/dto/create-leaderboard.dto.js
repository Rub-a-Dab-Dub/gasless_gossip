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
exports.CreateLeaderboardDto = void 0;
const class_validator_1 = require("class-validator");
const leaderboard_entity_1 = require("../entities/leaderboard.entity");
class CreateLeaderboardDto {
    rankType;
    userId;
    score;
}
exports.CreateLeaderboardDto = CreateLeaderboardDto;
__decorate([
    (0, class_validator_1.IsEnum)(leaderboard_entity_1.RankType),
    __metadata("design:type", String)
], CreateLeaderboardDto.prototype, "rankType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLeaderboardDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateLeaderboardDto.prototype, "score", void 0);
//# sourceMappingURL=create-leaderboard.dto.js.map