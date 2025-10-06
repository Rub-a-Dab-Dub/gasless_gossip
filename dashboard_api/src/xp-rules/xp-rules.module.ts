import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { XpRulesController } from "./xp-rules.controller"
import { XpRulesService } from "./xp-rules.service"
import { XpRule } from "./entities/xp-rule.entity"
import { XpRuleVersion } from "./entities/xp-rule-version.entity"
import { XpSimulation } from "./entities/xp-simulation.entity"
import { XpChangeNotification } from "./entities/xp-change-notification.entity"

@Module({
  imports: [TypeOrmModule.forFeature([XpRule, XpRuleVersion, XpSimulation, XpChangeNotification])],
  controllers: [XpRulesController],
  providers: [XpRulesService],
  exports: [XpRulesService],
})
export class XpRulesModule {}
