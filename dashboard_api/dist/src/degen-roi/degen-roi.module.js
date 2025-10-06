"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenRoiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const degen_roi_controller_1 = require("./degen-roi.controller");
const degen_roi_service_1 = require("./degen-roi.service");
const degen_roi_entity_1 = require("./entities/degen-roi.entity");
let DegenRoiModule = class DegenRoiModule {
};
exports.DegenRoiModule = DegenRoiModule;
exports.DegenRoiModule = DegenRoiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([degen_roi_entity_1.DegenRoiEntity])],
        controllers: [degen_roi_controller_1.DegenRoiController],
        providers: [degen_roi_service_1.DegenRoiService],
        exports: [degen_roi_service_1.DegenRoiService],
    })
], DegenRoiModule);
//# sourceMappingURL=degen-roi.module.js.map