"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reputation_entity_1 = require("./entities/reputation.entity");
const reputation_service_1 = require("./reputation.service");
const reputation_controller_1 = require("./reputation.controller");
const tip_entity_1 = require("../tips/entities/tip.entity");
const message_entity_1 = require("../messages/message.entity");
let ReputationModule = class ReputationModule {
};
exports.ReputationModule = ReputationModule;
exports.ReputationModule = ReputationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reputation_entity_1.Reputation, tip_entity_1.Tip, message_entity_1.Message])],
        providers: [reputation_service_1.ReputationService],
        controllers: [reputation_controller_1.ReputationController],
        exports: [reputation_service_1.ReputationService],
    })
], ReputationModule);
//# sourceMappingURL=reputation.module.js.map