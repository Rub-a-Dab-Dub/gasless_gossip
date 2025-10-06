"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialSharingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const social_sharing_controller_1 = require("./social-sharing.controller");
const social_sharing_service_1 = require("./social-sharing.service");
const share_entity_1 = require("./entities/share.entity");
const user_entity_1 = require("../users/entities/user.entity");
const xp_module_1 = require("../xp/xp.module");
let SocialSharingModule = class SocialSharingModule {
};
exports.SocialSharingModule = SocialSharingModule;
exports.SocialSharingModule = SocialSharingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([share_entity_1.Share, user_entity_1.User]),
            xp_module_1.XpModule,
        ],
        controllers: [social_sharing_controller_1.SocialSharingController],
        providers: [social_sharing_service_1.SocialSharingService],
        exports: [social_sharing_service_1.SocialSharingService],
    })
], SocialSharingModule);
//# sourceMappingURL=social-sharing.module.js.map