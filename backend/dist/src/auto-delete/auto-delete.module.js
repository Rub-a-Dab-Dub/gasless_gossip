"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDeleteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auto_delete_entity_1 = require("./entities/auto-delete.entity");
const auto_delete_service_1 = require("./services/auto-delete.service");
const auto_delete_controller_1 = require("./controllers/auto-delete.controller");
const message_entity_1 = require("../messages/message.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let AutoDeleteModule = class AutoDeleteModule {
};
exports.AutoDeleteModule = AutoDeleteModule;
exports.AutoDeleteModule = AutoDeleteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([auto_delete_entity_1.AutoDelete, message_entity_1.Message])],
        controllers: [auto_delete_controller_1.AutoDeleteController],
        providers: [auto_delete_service_1.AutoDeleteService, stellar_service_1.StellarService],
        exports: [auto_delete_service_1.AutoDeleteService],
    })
], AutoDeleteModule);
//# sourceMappingURL=auto-delete.module.js.map