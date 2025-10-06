"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemecoinsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const memecoins_controller_1 = require("./controllers/memecoins.controller");
const memecoins_service_1 = require("./services/memecoins.service");
const stellar_service_1 = require("./services/stellar.service");
const memecoin_drop_entity_1 = require("./entities/memecoin-drop.entity");
let MemecoinsModule = class MemecoinsModule {
};
exports.MemecoinsModule = MemecoinsModule;
exports.MemecoinsModule = MemecoinsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([memecoin_drop_entity_1.MemecoinDrop]),
            config_1.ConfigModule,
        ],
        controllers: [memecoins_controller_1.MemecoinsController],
        providers: [memecoins_service_1.MemecoinsService, stellar_service_1.StellarService],
        exports: [memecoins_service_1.MemecoinsService, stellar_service_1.StellarService],
    })
], MemecoinsModule);
//# sourceMappingURL=memecoins.module.js.map