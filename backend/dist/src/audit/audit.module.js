"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const audit_entity_1 = require("./entities/audit.entity");
const audit_service_1 = require("./audit.service");
const audit_controller_1 = require("./audit.controller");
let AuditLogsModule = class AuditLogsModule {
};
exports.AuditLogsModule = AuditLogsModule;
exports.AuditLogsModule = AuditLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([audit_entity_1.AuditLog])],
        providers: [audit_service_1.AuditLogsService],
        controllers: [audit_controller_1.AuditLogsController],
        exports: [audit_service_1.AuditLogsService],
    })
], AuditLogsModule);
//# sourceMappingURL=audit.module.js.map