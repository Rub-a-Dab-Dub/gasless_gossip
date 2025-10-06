"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudonymsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pseudonym_entity_1 = require("./entities/pseudonym.entity");
const pseudonyms_service_1 = require("./services/pseudonyms.service");
const pseudonyms_controller_1 = require("./controllers/pseudonyms.controller");
let PseudonymsModule = class PseudonymsModule {
};
exports.PseudonymsModule = PseudonymsModule;
exports.PseudonymsModule = PseudonymsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pseudonym_entity_1.Pseudonym])],
        controllers: [pseudonyms_controller_1.PseudonymsController],
        providers: [pseudonyms_service_1.PseudonymsService],
        exports: [pseudonyms_service_1.PseudonymsService],
    })
], PseudonymsModule);
//# sourceMappingURL=pseudonyms.module.js.map