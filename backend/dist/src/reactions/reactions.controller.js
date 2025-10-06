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
exports.ReactionsController = void 0;
const common_1 = require("@nestjs/common");
const reactions_service_1 = require("./reactions.service");
const create_reaction_dto_1 = require("./dto/create-reaction.dto");
let ReactionsController = class ReactionsController {
    reactionsService;
    constructor(reactionsService) {
        this.reactionsService = reactionsService;
    }
    async addReaction(dto) {
        return this.reactionsService.addReaction(dto);
    }
    async getReactions(messageId) {
        return this.reactionsService.countReactions(messageId);
    }
};
exports.ReactionsController = ReactionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reaction_dto_1.CreateReactionDto]),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Get)(':messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "getReactions", null);
exports.ReactionsController = ReactionsController = __decorate([
    (0, common_1.Controller)('reactions'),
    __metadata("design:paramtypes", [reactions_service_1.ReactionsService])
], ReactionsController);
//# sourceMappingURL=reactions.controller.js.map