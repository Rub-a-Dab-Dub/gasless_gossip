"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpRulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const xp_rules_controller_1 = require("./xp-rules.controller");
const xp_rules_service_1 = require("./xp-rules.service");
const xp_rule_entity_1 = require("./entities/xp-rule.entity");
const xp_rule_version_entity_1 = require("./entities/xp-rule-version.entity");
const xp_simulation_entity_1 = require("./entities/xp-simulation.entity");
const xp_change_notification_entity_1 = require("./entities/xp-change-notification.entity");
let XpRulesModule = class XpRulesModule {
};
exports.XpRulesModule = XpRulesModule;
exports.XpRulesModule = XpRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([xp_rule_entity_1.XpRule, xp_rule_version_entity_1.XpRuleVersion, xp_simulation_entity_1.XpSimulation, xp_change_notification_entity_1.XpChangeNotification])],
        controllers: [xp_rules_controller_1.XpRulesController],
        providers: [xp_rules_service_1.XpRulesService],
        exports: [xp_rules_service_1.XpRulesService],
    })
], XpRulesModule);
//# sourceMappingURL=xp-rules.module.js.map