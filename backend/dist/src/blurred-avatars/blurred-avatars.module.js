"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlurredAvatarsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const blurred_avatars_service_1 = require("./blurred-avatars.service");
const blurred_avatars_controller_1 = require("./blurred-avatars.controller");
const blurred_avatar_entity_1 = require("./entities/blurred-avatar.entity");
let BlurredAvatarsModule = class BlurredAvatarsModule {
};
exports.BlurredAvatarsModule = BlurredAvatarsModule;
exports.BlurredAvatarsModule = BlurredAvatarsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([blurred_avatar_entity_1.BlurredAvatar])],
        controllers: [blurred_avatars_controller_1.BlurredAvatarsController],
        providers: [blurred_avatars_service_1.BlurredAvatarsService],
        exports: [blurred_avatars_service_1.BlurredAvatarsService],
    })
], BlurredAvatarsModule);
//# sourceMappingURL=blurred-avatars.module.js.map