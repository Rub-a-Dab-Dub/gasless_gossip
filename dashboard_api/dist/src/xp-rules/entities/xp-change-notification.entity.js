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
exports.XpChangeNotification = void 0;
const typeorm_1 = require("typeorm");
let XpChangeNotification = class XpChangeNotification {
    id;
    userId;
    notificationType;
    title;
    message;
    changes;
    isRead;
    readAt;
    createdAt;
};
exports.XpChangeNotification = XpChangeNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], XpChangeNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XpChangeNotification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], XpChangeNotification.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], XpChangeNotification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], XpChangeNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], XpChangeNotification.prototype, "changes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], XpChangeNotification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], XpChangeNotification.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], XpChangeNotification.prototype, "createdAt", void 0);
exports.XpChangeNotification = XpChangeNotification = __decorate([
    (0, typeorm_1.Entity)("xp_change_notifications"),
    (0, typeorm_1.Index)(["userId", "isRead"])
], XpChangeNotification);
//# sourceMappingURL=xp-change-notification.entity.js.map