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
exports.PseudonymsController = void 0;
const common_1 = require("@nestjs/common");
const pseudonyms_service_1 = require("../services/pseudonyms.service");
const set_pseudonym_dto_1 = require("../dto/set-pseudonym.dto");
const get_room_pseudonyms_dto_1 = require("../dto/get-room-pseudonyms.dto");
let PseudonymsController = class PseudonymsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async set(body) {
        const result = await this.service.setPseudonym(body.roomId, body.userId, body.pseudonym);
        return { id: result.id, roomId: result.roomId, userId: result.userId, pseudonym: result.pseudonym };
    }
    async list(params) {
        const list = await this.service.getRoomPseudonyms(params.roomId);
        return list.map((p) => ({ id: p.id, roomId: p.roomId, userId: p.userId, pseudonym: p.pseudonym }));
    }
};
exports.PseudonymsController = PseudonymsController;
__decorate([
    (0, common_1.Post)('set'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_pseudonym_dto_1.SetPseudonymDto]),
    __metadata("design:returntype", Promise)
], PseudonymsController.prototype, "set", null);
__decorate([
    (0, common_1.Get)(':roomId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_room_pseudonyms_dto_1.GetRoomPseudonymsParamsDto]),
    __metadata("design:returntype", Promise)
], PseudonymsController.prototype, "list", null);
exports.PseudonymsController = PseudonymsController = __decorate([
    (0, common_1.Controller)('pseudonyms'),
    __metadata("design:paramtypes", [pseudonyms_service_1.PseudonymsService])
], PseudonymsController);
//# sourceMappingURL=pseudonyms.controller.js.map