"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const invitation_entity_1 = require("./entities/invitation.entity");
const room_participant_entity_1 = require("./entities/room-participant.entity");
const invitations_service_1 = require("./services/invitations.service");
const enhanced_invitations_service_1 = require("./services/enhanced-invitations.service");
const stellar_invitation_service_1 = require("./services/stellar-invitation.service");
const code_generator_service_1 = require("./services/code-generator.service");
const room_access_service_1 = require("./services/room-access.service");
const invitations_controller_1 = require("./controllers/invitations.controller");
const stellar_invitations_controller_1 = require("./controllers/stellar-invitations.controller");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const room_access_guard_1 = require("../auth/guards/room-access.guard");
const room_admin_guard_1 = require("../auth/guards/room-admin.guard");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const invitation_analytics_listener_1 = require("./listeners/invitation-analytics.listener");
let InvitationsModule = class InvitationsModule {
};
exports.InvitationsModule = InvitationsModule;
exports.InvitationsModule = InvitationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invitation_entity_1.Invitation, room_participant_entity_1.RoomParticipant]),
            config_1.ConfigModule,
            event_emitter_1.EventEmitterModule,
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get("JWT_SECRET", "your-secret-key"),
                    signOptions: {
                        expiresIn: configService.get("JWT_EXPIRES_IN", "24h"),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [invitations_controller_1.InvitationsController, stellar_invitations_controller_1.StellarInvitationsController],
        providers: [
            invitations_service_1.InvitationsService,
            enhanced_invitations_service_1.EnhancedInvitationsService,
            stellar_invitation_service_1.StellarInvitationService,
            code_generator_service_1.CodeGeneratorService,
            room_access_service_1.RoomAccessService,
            jwt_auth_guard_1.JwtAuthGuard,
            room_access_guard_1.RoomAccessGuard,
            room_admin_guard_1.RoomAdminGuard,
            jwt_strategy_1.JwtStrategy,
            invitation_analytics_listener_1.InvitationAnalyticsListener,
        ],
        exports: [invitations_service_1.InvitationsService, enhanced_invitations_service_1.EnhancedInvitationsService, stellar_invitation_service_1.StellarInvitationService, room_access_service_1.RoomAccessService],
    })
], InvitationsModule);
//# sourceMappingURL=invitations.module.js.map