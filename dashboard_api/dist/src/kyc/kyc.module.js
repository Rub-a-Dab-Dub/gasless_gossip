"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const kyc_controller_1 = require("./kyc.controller");
const kyc_service_1 = require("./services/kyc.service");
const document_storage_service_1 = require("./services/document-storage.service");
const blockchain_verify_service_1 = require("./services/blockchain-verify.service");
const kyc_threshold_service_1 = require("./services/kyc-threshold.service");
const admin_kyc_guard_1 = require("./guards/admin-kyc.guard");
const kyc_entity_1 = require("./entities/kyc.entity");
const kyc_audit_entity_1 = require("./entities/kyc-audit.entity");
const kyc_thresholds_config_1 = __importDefault(require("../config/kyc-thresholds.config"));
let KycModule = class KycModule {
};
exports.KycModule = KycModule;
exports.KycModule = KycModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([kyc_entity_1.Kyc, kyc_audit_entity_1.KycAudit]),
            config_1.ConfigModule.forFeature(kyc_thresholds_config_1.default),
        ],
        controllers: [kyc_controller_1.KycController],
        providers: [
            kyc_service_1.KycService,
            document_storage_service_1.DocumentStorageService,
            blockchain_verify_service_1.BlockchainVerifyService,
            kyc_threshold_service_1.KycThresholdService,
            admin_kyc_guard_1.AdminKycGuard,
        ],
        exports: [kyc_service_1.KycService, kyc_threshold_service_1.KycThresholdService],
    })
], KycModule);
//# sourceMappingURL=kyc.module.js.map