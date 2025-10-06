"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const avatars_controller_1 = require("./avatars.controller");
const avatars_service_1 = require("./avatars.service");
const stellar_nft_service_1 = require("./services/stellar-nft.service");
const avatar_entity_1 = require("./entities/avatar.entity");
let AvatarsModule = class AvatarsModule {
};
exports.AvatarsModule = AvatarsModule;
exports.AvatarsModule = AvatarsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([avatar_entity_1.Avatar]), config_1.ConfigModule],
        controllers: [avatars_controller_1.AvatarsController],
        providers: [avatars_service_1.AvatarsService, stellar_nft_service_1.StellarNftService],
        exports: [avatars_service_1.AvatarsService],
    })
], AvatarsModule);
//# sourceMappingURL=avatars.module.js.map