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
var LevelUpListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUpListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let LevelUpListener = LevelUpListener_1 = class LevelUpListener {
    logger = new common_1.Logger(LevelUpListener_1.name);
    async handleLevelUpEvent(event) {
        this.logger.log(`Level up event: User ${event.userId} reached level ${event.newLevel} (from ${event.previousLevel}) with ${event.totalXp} total XP`);
        if (event.badgesUnlocked.length > 0) {
            this.logger.log(`Badges unlocked for user ${event.userId}: ${event.badgesUnlocked.join(', ')}`);
        }
    }
};
exports.LevelUpListener = LevelUpListener;
__decorate([
    (0, event_emitter_1.OnEvent)('level.up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], LevelUpListener.prototype, "handleLevelUpEvent", null);
exports.LevelUpListener = LevelUpListener = LevelUpListener_1 = __decorate([
    (0, common_1.Injectable)()
], LevelUpListener);
//# sourceMappingURL=level-up.listener.js.map