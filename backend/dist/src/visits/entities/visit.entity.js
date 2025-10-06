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
exports.Visit = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Visit = class Visit {
    id;
    roomId;
    userId;
    createdAt;
    ipAddress;
    userAgent;
    referrer;
    duration;
    user;
};
exports.Visit = Visit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Visit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Visit.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Visit.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Visit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], Visit.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], Visit.prototype, "user", void 0);
exports.Visit = Visit = __decorate([
    (0, typeorm_1.Entity)("visits"),
    (0, typeorm_1.Index)(["roomId", "userId", "createdAt"]),
    (0, typeorm_1.Index)(["roomId", "createdAt"])
], Visit);
//# sourceMappingURL=visit.entity.js.map