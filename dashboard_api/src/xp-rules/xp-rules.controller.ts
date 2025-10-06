import { Controller, Get, Post, Put } from "@nestjs/common"
import type { XpRulesService } from "./xp-rules.service"
import type { CreateXpRuleDto } from "./dto/create-xp-rule.dto"
import type { UpdateXpRuleDto } from "./dto/update-xp-rule.dto"
import type { SimulateImpactDto } from "./dto/simulate-impact.dto"
import type { ApplyRulesDto } from "./dto/apply-rules.dto"

@Controller("xp-rules")
export class XpRulesController {
  constructor(private readonly xpRulesService: XpRulesService) {}

  @Post()
  async createRule(dto: CreateXpRuleDto) {
    return this.xpRulesService.createRule(dto)
  }

  @Put(":ruleId")
  async updateRule(ruleId: string, dto: UpdateXpRuleDto) {
    return this.xpRulesService.updateRule(ruleId, dto)
  }

  @Get("active")
  async getActiveRules(scope?: string) {
    return this.xpRulesService.getActiveRules(scope)
  }

  @Post("apply")
  async applyGlobalRules(userId: string, ruleType: string, baseXp: number) {
    return this.xpRulesService.applyGlobalRules(userId, ruleType, baseXp)
  }

  @Post("simulate")
  async simulateImpact(dto: SimulateImpactDto) {
    return this.xpRulesService.simulateImpact(dto)
  }

  @Post("apply-simulation")
  async applySimulation(dto: ApplyRulesDto) {
    return this.xpRulesService.applySimulation(dto)
  }

  @Get(":ruleId/versions")
  async getRuleVersions(ruleId: string) {
    return this.xpRulesService.getRuleVersions(ruleId)
  }

  @Get("simulations")
  async getSimulations(limit?: number) {
    return this.xpRulesService.getSimulations(limit)
  }

  @Get("notifications/:userId")
  async getUserNotifications(userId: string, unreadOnly?: boolean) {
    return this.xpRulesService.getUserNotifications(userId, unreadOnly)
  }

  @Put("notifications/:notificationId/read")
  async markNotificationRead(notificationId: string) {
    return this.xpRulesService.markNotificationRead(notificationId)
  }
}
