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
exports.Hook = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
var EventType;
(function (EventType) {
    EventType["XP_UPDATE"] = "xp_update";
    EventType["TOKEN_SEND"] = "token_send";
    EventType["TOKEN_RECEIVE"] = "token_receive";
    EventType["CONTRACT_CALL"] = "contract_call";
    EventType["ACCOUNT_CREATED"] = "account_created";
})(EventType || (exports.EventType = EventType = {}));
let Hook = class Hook {
    id;
    eventType;
    data;
    stellarTransactionId;
    stellarAccountId;
    processed;
    createdAt;
    processedAt;
    errorMessage;
};
exports.Hook = Hook;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Hook.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EventType,
        nullable: false
    }),
    __metadata("design:type", String)
], Hook.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Hook.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hook.prototype, "stellarTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hook.prototype, "stellarAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Hook.prototype, "processed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Hook.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Hook.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hook.prototype, "errorMessage", void 0);
exports.Hook = Hook = __decorate([
    (0, typeorm_1.Entity)('hooks'),
    (0, typeorm_1.Index)(['eventType', 'createdAt'])
], Hook);
//# sourceMappingURL=hook.entity.js.map