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
exports.TradesController = void 0;
const common_1 = require("@nestjs/common");
const propose_trade_dto_1 = require("./dto/propose-trade.dto");
const accept_trade_dto_1 = require("./dto/accept-trade.dto");
const trade_service_1 = require("./trade.service");
let TradesController = class TradesController {
    tradesService;
    constructor(tradesService) {
        this.tradesService = tradesService;
    }
    proposeTrade(dto) {
        return this.tradesService.proposeTrade(dto);
    }
    acceptTrade(dto) {
        return this.tradesService.acceptTrade(dto);
    }
};
exports.TradesController = TradesController;
__decorate([
    (0, common_1.Post)('propose'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [propose_trade_dto_1.ProposeTradeDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "proposeTrade", null);
__decorate([
    (0, common_1.Post)('accept'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accept_trade_dto_1.AcceptTradeDto]),
    __metadata("design:returntype", void 0)
], TradesController.prototype, "acceptTrade", null);
exports.TradesController = TradesController = __decorate([
    (0, common_1.Controller)('trades'),
    __metadata("design:paramtypes", [trade_service_1.TradesService])
], TradesController);
//# sourceMappingURL=trade.controller.js.map