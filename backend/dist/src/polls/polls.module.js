"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const poll_entity_1 = require("./entities/poll.entity");
const poll_vote_entity_1 = require("./entities/poll-vote.entity");
const polls_service_1 = require("./services/polls.service");
const polls_controller_1 = require("./polls.controller");
const invitations_module_1 = require("../invitations/invitations.module");
const users_module_1 = require("../users/users.module");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const room_access_guard_1 = require("../auth/guards/room-access.guard");
const room_admin_guard_1 = require("../auth/guards/room-admin.guard");
let PollsModule = class PollsModule {
};
exports.PollsModule = PollsModule;
exports.PollsModule = PollsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([poll_entity_1.Poll, poll_vote_entity_1.PollVote]),
            invitations_module_1.InvitationsModule,
            users_module_1.UsersModule,
        ],
        controllers: [polls_controller_1.PollsController],
        providers: [polls_service_1.PollsService, jwt_auth_guard_1.JwtAuthGuard, room_access_guard_1.RoomAccessGuard, room_admin_guard_1.RoomAdminGuard],
        exports: [polls_service_1.PollsService],
    })
], PollsModule);
//# sourceMappingURL=polls.module.js.map