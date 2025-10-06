import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RateLimitingController } from "./rate-limiting.controller"
import { RateLimitingService } from "./rate-limiting.service"
import { RateLimitConfig } from "./entities/rate-limit-config.entity"
import { RateLimitWhitelist } from "./entities/rate-limit-whitelist.entity"
import { RateLimitAbuseLog } from "./entities/rate-limit-abuse-log.entity"

@Module({
  imports: [TypeOrmModule.forFeature([RateLimitConfig, RateLimitWhitelist, RateLimitAbuseLog])],
  controllers: [RateLimitingController],
  providers: [RateLimitingService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
