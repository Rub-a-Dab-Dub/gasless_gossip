"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenLeaderboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const degen_leaderboard_controller_1 = require("./degen-leaderboard.controller");
const degen_leaderboard_service_1 = require("./degen-leaderboard.service");
const degen_score_entity_1 = require("./entities/degen-score.entity");
const leaderboard_badge_entity_1 = require("./entities/leaderboard-badge.entity");
const leaderboard_event_entity_1 = require("./entities/leaderboard-event.entity");
let DegenLeaderboardModule = class DegenLeaderboardModule {
};
exports.DegenLeaderboardModule = DegenLeaderboardModule;
exports.DegenLeaderboardModule = DegenLeaderboardModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([degen_score_entity_1.DegenScore, leaderboard_badge_entity_1.LeaderboardBadge, leaderboard_event_entity_1.LeaderboardEvent])],
        controllers: [degen_leaderboard_controller_1.DegenLeaderboardController],
        providers: [degen_leaderboard_service_1.DegenLeaderboardService],
        exports: [degen_leaderboard_service_1.DegenLeaderboardService],
    })
], DegenLeaderboardModule);
//# sourceMappingURL=degen-leaderboard.module.js.map