"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfProtectionModule = void 0;
const common_1 = require("@nestjs/common");
const csrf_protection_service_1 = require("./csrf-protection.service");
const csrf_protection_controller_1 = require("./csrf-protection.controller");
const csrf_validation_middleware_1 = require("./middleware/csrf-validation.middleware");
let CsrfProtectionModule = class CsrfProtectionModule {
    configure(consumer) {
        consumer
            .apply(csrf_validation_middleware_1.CsrfValidationMiddleware)
            .forRoutes({ path: 'auth/login', method: common_1.RequestMethod.POST });
    }
};
exports.CsrfProtectionModule = CsrfProtectionModule;
exports.CsrfProtectionModule = CsrfProtectionModule = __decorate([
    (0, common_1.Module)({
        providers: [csrf_protection_service_1.CsrfProtectionService],
        controllers: [csrf_protection_controller_1.CsrfProtectionController],
        exports: [csrf_protection_service_1.CsrfProtectionService],
    })
], CsrfProtectionModule);
//# sourceMappingURL=csrf-protection.module.js.map