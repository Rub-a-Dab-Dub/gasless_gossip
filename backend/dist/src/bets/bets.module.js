"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bets_controller_1 = require("./bets.controller");
const bets_service_1 = require("./bets.service");
const bet_entity_1 = require("./bet.entity");
const auth_module_1 = require("../auth/auth.module");
let BetsModule = class BetsModule {
};
exports.BetsModule = BetsModule;
exports.BetsModule = BetsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bet_entity_1.Bet]), auth_module_1.AuthModule],
        controllers: [bets_controller_1.BetsController],
        providers: [bets_service_1.BetsService],
        exports: [bets_service_1.BetsService],
    })
], BetsModule);
//# sourceMappingURL=bets.module.js.map