"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGiftModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_gift_entity_1 = require("./entities/token-gift.entity");
const token_gift_transaction_entity_1 = require("./entities/token-gift-transaction.entity");
const token_gift_service_1 = require("./services/token-gift.service");
const token_gift_controller_1 = require("./token-gift.controller");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const config_1 = require("@nestjs/config");
let TokenGiftModule = class TokenGiftModule {
};
exports.TokenGiftModule = TokenGiftModule;
exports.TokenGiftModule = TokenGiftModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([token_gift_entity_1.TokenGift, token_gift_transaction_entity_1.TokenGiftTransaction]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            config_1.ConfigModule,
        ],
        controllers: [token_gift_controller_1.TokenGiftController],
        providers: [token_gift_service_1.TokenGiftService],
        exports: [token_gift_service_1.TokenGiftService],
    })
], TokenGiftModule);
//# sourceMappingURL=token-gift.module.js.map