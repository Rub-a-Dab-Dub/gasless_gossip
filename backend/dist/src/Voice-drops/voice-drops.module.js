"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceDropsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const voice_drop_entity_1 = require("./entities/voice-drop.entity");
const voice_drops_controller_1 = require("./controllers/voice-drops.controller");
const voice_drops_service_1 = require("./services/voice-drops.service");
const ipfs_service_1 = require("./services/ipfs.service");
const stellar_service_1 = require("./services/stellar.service");
let VoiceDropsModule = class VoiceDropsModule {
};
exports.VoiceDropsModule = VoiceDropsModule;
exports.VoiceDropsModule = VoiceDropsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([voice_drop_entity_1.VoiceDrop]),
            config_1.ConfigModule,
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
            }),
        ],
        controllers: [voice_drops_controller_1.VoiceDropsController],
        providers: [voice_drops_service_1.VoiceDropsService, ipfs_service_1.IpfsService, stellar_service_1.StellarService],
        exports: [voice_drops_service_1.VoiceDropsService],
    })
], VoiceDropsModule);
//# sourceMappingURL=voice-drops.module.js.map