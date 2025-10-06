"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletIntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const wallet_integration_controller_1 = require("./wallet-integration.controller");
const wallet_integration_service_1 = require("./services/wallet-integration.service");
const wallet_connection_entity_1 = require("./entities/wallet-connection.entity");
let WalletIntegrationModule = class WalletIntegrationModule {
};
exports.WalletIntegrationModule = WalletIntegrationModule;
exports.WalletIntegrationModule = WalletIntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([wallet_connection_entity_1.WalletConnection]),
            config_1.ConfigModule,
        ],
        controllers: [wallet_integration_controller_1.WalletIntegrationController],
        providers: [wallet_integration_service_1.WalletIntegrationService],
        exports: [wallet_integration_service_1.WalletIntegrationService],
    })
], WalletIntegrationModule);
//# sourceMappingURL=wallet-integration.module.js.map