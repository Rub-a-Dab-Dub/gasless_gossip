import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { ConfigModule } from "@nestjs/config"

// Entities
import { Level } from "./entities/level.entity"

// Services
import { LevelsService } from "./services/levels.service"
import { StellarService } from "./services/stellar.service"
import { NotificationService } from "./services/notification.service"
import { AnalyticsService } from "./services/analytics.service"
import { DynamicXpThresholdsService } from "./config/dynamic-xp-thresholds.service"

// Controllers
import { LevelsController } from "./controllers/levels.controller"
import { StellarController } from "./controllers/stellar.controller"
import { ConfigController } from "./controllers/config.controller"

// Listeners
import { LevelUpListener } from "./listeners/level-up.listener"
import { NotificationListener } from "./listeners/notification.listener"

// Gateways
import { LevelsGateway } from "./gateways/levels.gateway"

// Configuration
import { stellarConfigFactory, STELLAR_CONFIG_TOKEN } from "./config/stellar.config"

@Module({
  imports: [
    TypeOrmModule.forFeature([Level]),
    EventEmitterModule.forRoot(),
    ConfigModule.forFeature(stellarConfigFactory),
  ],
  controllers: [LevelsController, StellarController, ConfigController],
  providers: [
    LevelsService,
    StellarService,
    NotificationService,
    AnalyticsService,
    DynamicXpThresholdsService,
    LevelUpListener,
    NotificationListener,
    LevelsGateway,
    {
      provide: STELLAR_CONFIG_TOKEN,
      useFactory: stellarConfigFactory,
    },
  ],
  exports: [LevelsService, StellarService, DynamicXpThresholdsService],
})
export class LevelsModule {}
