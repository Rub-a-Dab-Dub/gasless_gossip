"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestAuditModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quest_audit_controller_1 = require("./quest-audit.controller");
const quest_audit_service_1 = require("./quest-audit.service");
const quest_completion_entity_1 = require("./entities/quest-completion.entity");
const exploit_pattern_entity_1 = require("./entities/exploit-pattern.entity");
const audit_alert_entity_1 = require("./entities/audit-alert.entity");
let QuestAuditModule = class QuestAuditModule {
};
exports.QuestAuditModule = QuestAuditModule;
exports.QuestAuditModule = QuestAuditModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([quest_completion_entity_1.QuestCompletion, exploit_pattern_entity_1.ExploitPattern, audit_alert_entity_1.AuditAlert])],
        controllers: [quest_audit_controller_1.QuestAuditController],
        providers: [quest_audit_service_1.QuestAuditService],
        exports: [quest_audit_service_1.QuestAuditService],
    })
], QuestAuditModule);
//# sourceMappingURL=quest-audit.module.js.map