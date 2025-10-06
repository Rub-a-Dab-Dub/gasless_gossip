"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAccessGuard = void 0;
const common_1 = require("@nestjs/common");
let RoomAccessGuard = class RoomAccessGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { roomId } = request.body || request.query;
        const user = request.user;
        const hasAccess = await this.checkRoomAccess(user, roomId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('No access to this room');
        }
        return true;
    }
    async checkRoomAccess(user, roomId) {
        return true;
    }
};
exports.RoomAccessGuard = RoomAccessGuard;
exports.RoomAccessGuard = RoomAccessGuard = __decorate([
    (0, common_1.Injectable)()
], RoomAccessGuard);
//# sourceMappingURL=room-access.guard.js.map