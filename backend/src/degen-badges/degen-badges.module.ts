import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { DegenBadge } from "./entities/degen-badge.entity"
import { DegenBadgesService } from "./services/degen-badges.service"
import { StellarBadgeService } from "./services/stellar-badge.service"
import { DegenBadgesController } from "./controllers/degen-badges.controller"
import { BadgeAnalyticsListener } from "./listeners/badge-analytics.listener"

@Module({
  imports: [TypeOrmModule.forFeature([DegenBadge]), ConfigModule, EventEmitterModule],
  controllers: [DegenBadgesController],
  providers: [DegenBadgesService, StellarBadgeService, BadgeAnalyticsListener],
  exports: [DegenBadgesService, StellarBadgeService],
})
export class DegenBadgesModule {}
