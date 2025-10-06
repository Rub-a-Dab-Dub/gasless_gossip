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
exports.PollsController = void 0;
const common_1 = require("@nestjs/common");
const polls_service_1 = require("./services/polls.service");
const create_poll_dto_1 = require("./dto/create-poll.dto");
const vote_dto_1 = require("./dto/vote.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const room_access_guard_1 = require("../auth/guards/room-access.guard");
const room_admin_guard_1 = require("../auth/guards/room-admin.guard");
let PollsController = class PollsController {
    pollsService;
    constructor(pollsService) {
        this.pollsService = pollsService;
    }
    async create(req, dto) {
        const poll = await this.pollsService.createPoll(dto, req.user.id);
        return poll;
    }
    async vote(req, dto) {
        const result = await this.pollsService.vote(dto, req.user.id);
        return result;
    }
    async list(req, roomId) {
        const polls = await this.pollsService.listPollsForRoom(roomId, req.user.id);
        return polls;
    }
};
exports.PollsController = PollsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(room_admin_guard_1.RoomAdminGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_poll_dto_1.CreatePollDto]),
    __metadata("design:returntype", Promise)
], PollsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vote_dto_1.VoteDto]),
    __metadata("design:returntype", Promise)
], PollsController.prototype, "vote", null);
__decorate([
    (0, common_1.Get)(':roomId'),
    (0, common_1.UseGuards)(room_access_guard_1.RoomAccessGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PollsController.prototype, "list", null);
exports.PollsController = PollsController = __decorate([
    (0, common_1.Controller)('polls'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [polls_service_1.PollsService])
], PollsController);
//# sourceMappingURL=polls.controller.js.map