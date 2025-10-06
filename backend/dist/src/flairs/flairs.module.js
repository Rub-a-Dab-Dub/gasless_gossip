"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlairsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flairs_service_1 = require("./flairs.service");
const flairs_controller_1 = require("./flairs.controller");
const flair_entity_1 = require("./entities/flair.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let FlairsModule = class FlairsModule {
};
exports.FlairsModule = FlairsModule;
exports.FlairsModule = FlairsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flair_entity_1.Flair])],
        controllers: [flairs_controller_1.FlairsController],
        providers: [flairs_service_1.FlairsService, stellar_service_1.StellarService],
        exports: [flairs_service_1.FlairsService],
    })
], FlairsModule);
//# sourceMappingURL=flairs.module.js.map