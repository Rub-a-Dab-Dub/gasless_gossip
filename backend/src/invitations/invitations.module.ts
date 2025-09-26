import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"

// Entities
import { Invitation } from "./entities/invitation.entity"
import { RoomParticipant } from "./entities/room-participant.entity"

// Services
import { InvitationsService } from "./services/invitations.service"
import { EnhancedInvitationsService } from "./services/enhanced-invitations.service"
import { StellarInvitationService } from "./services/stellar-invitation.service"
import { CodeGeneratorService } from "./services/code-generator.service"
import { RoomAccessService } from "./services/room-access.service"

// Controllers
import { InvitationsController } from "./controllers/invitations.controller"
import { StellarInvitationsController } from "./controllers/stellar-invitations.controller"

// Guards
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RoomAccessGuard } from "../auth/guards/room-access.guard"
import { RoomAdminGuard } from "../auth/guards/room-admin.guard"

// Strategies
import { JwtStrategy } from "../auth/strategies/jwt.strategy"

// Listeners
import { InvitationAnalyticsListener } from "./listeners/invitation-analytics.listener"

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, RoomParticipant]),
    ConfigModule,
    EventEmitterModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "your-secret-key"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "24h"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InvitationsController, StellarInvitationsController],
  providers: [
    // Services
    InvitationsService,
    EnhancedInvitationsService,
    StellarInvitationService,
    CodeGeneratorService,
    RoomAccessService,

    // Guards
    JwtAuthGuard,
    RoomAccessGuard,
    RoomAdminGuard,

    // Strategies
    JwtStrategy,

    // Listeners
    InvitationAnalyticsListener,
  ],
  exports: [InvitationsService, EnhancedInvitationsService, StellarInvitationService, RoomAccessService],
})
export class InvitationsModule {}
