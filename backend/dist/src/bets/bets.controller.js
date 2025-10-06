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
exports.BetsController = void 0;
const common_1 = require("@nestjs/common");
const bets_service_1 = require("./bets.service");
const place_bet_dto_1 = require("./dto/place-bet.dto");
const resolve_bet_dto_1 = require("./dto/resolve-bet.dto");
const auth_guard_1 = require("../auth/auth.guard");
let BetsController = class BetsController {
    betsService;
    constructor(betsService) {
        this.betsService = betsService;
    }
    async placeBet(req, placeBetDto) {
        return this.betsService.placeBet(req.user.id, placeBetDto);
    }
    async resolveBet(resolveBetDto) {
        return this.betsService.resolveBet(resolveBetDto);
    }
};
exports.BetsController = BetsController;
__decorate([
    (0, common_1.Post)('place'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, place_bet_dto_1.PlaceBetDto]),
    __metadata("design:returntype", Promise)
], BetsController.prototype, "placeBet", null);
__decorate([
    (0, common_1.Post)('resolve'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resolve_bet_dto_1.ResolveBetDto]),
    __metadata("design:returntype", Promise)
], BetsController.prototype, "resolveBet", null);
exports.BetsController = BetsController = __decorate([
    (0, common_1.Controller)('bets'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [bets_service_1.BetsService])
], BetsController);
//# sourceMappingURL=bets.controller.js.map