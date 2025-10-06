"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudonymController = void 0;
const common_1 = require("@nestjs/common");
const pseudonym_service_1 = require("./pseudonym.service");
const create_pseudonym_dto_1 = require("./dto/create-pseudonym.dto");
const update_pseudonym_dto_1 = require("./dto/update-pseudonym.dto");
let PseudonymController = class PseudonymController {
    pseudonymService;
    constructor(pseudonymService) {
        this.pseudonymService = pseudonymService;
    }
    create(createPseudonymDto) {
        return this.pseudonymService.create(createPseudonymDto);
    }
    findAll() {
        return this.pseudonymService.findAll();
    }
    findOne(id) {
        return this.pseudonymService.findOne(+id);
    }
    update(id, updatePseudonymDto) {
        return this.pseudonymService.update(+id, updatePseudonymDto);
    }
    remove(id) {
        return this.pseudonymService.remove(+id);
    }
};
exports.PseudonymController = PseudonymController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pseudonym_dto_1.CreatePseudonymDto]),
    __metadata("design:returntype", void 0)
], PseudonymController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PseudonymController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PseudonymController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pseudonym_dto_1.UpdatePseudonymDto]),
    __metadata("design:returntype", void 0)
], PseudonymController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PseudonymController.prototype, "remove", null);
exports.PseudonymController = PseudonymController = __decorate([
    (0, common_1.Controller)('pseudonym'),
    __metadata("design:paramtypes", [pseudonym_service_1.PseudonymService])
], PseudonymController);
//# sourceMappingURL=pseudonym.controller.js.map