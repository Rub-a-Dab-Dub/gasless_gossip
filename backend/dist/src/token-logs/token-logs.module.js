"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenLogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_log_entity_1 = require("./token-log.entity");
const token_logs_service_1 = require("./token-logs.service");
const token_logs_controller_1 = require("./token-logs.controller");
let TokenLogsModule = class TokenLogsModule {
};
exports.TokenLogsModule = TokenLogsModule;
exports.TokenLogsModule = TokenLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([token_log_entity_1.TokenLog])],
        providers: [token_logs_service_1.TokenLogsService],
        controllers: [token_logs_controller_1.TokenLogsController],
        exports: [token_logs_service_1.TokenLogsService],
    })
], TokenLogsModule);
//# sourceMappingURL=token-logs.module.js.map