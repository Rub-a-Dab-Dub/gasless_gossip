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
exports.EventBoostService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let EventBoostService = class EventBoostService {
    isActive = false;
    globalFlag = false;
    impactData = [];
    handleCron() {
        if (this.isActive) {
            common_1.Logger.log('XP double event is active');
            this.updateImpact();
        }
    }
    activateBoost() {
        if (!this.isActive) {
            this.isActive = true;
            this.impactData.push({ startTime: new Date(), usersAffected: 0 });
            common_1.Logger.log('XP double event activated');
        }
    }
    deactivateBoost() {
        if (this.isActive) {
            this.isActive = false;
            common_1.Logger.log('XP double event deactivated');
        }
    }
    updateImpact() {
        const currentEvent = this.impactData[this.impactData.length - 1];
        if (currentEvent) {
            currentEvent.usersAffected += 10;
            common_1.Logger.log(`Impact updated: ${currentEvent.usersAffected} users affected`);
        }
    }
    deleteEvent() {
        if (this.isActive) {
            this.impactData.pop();
            this.deactivateBoost();
            common_1.Logger.log('Event deleted, users notified');
        }
    }
    getReport() {
        return this.impactData.length > 0
            ? `Post-event report: ${JSON.stringify(this.impactData)}`
            : 'No events recorded';
    }
    setGlobalFlag(flag) {
        this.globalFlag = flag;
        common_1.Logger.log(`A/B test flag set to: ${flag}`);
    }
};
exports.EventBoostService = EventBoostService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventBoostService.prototype, "handleCron", null);
exports.EventBoostService = EventBoostService = __decorate([
    (0, common_1.Injectable)()
], EventBoostService);
//# sourceMappingURL=event-boost.service.js.map