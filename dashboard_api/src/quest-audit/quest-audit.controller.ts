import { Controller, Get, Post, Put } from "@nestjs/common"
import type { QuestAuditService } from "./quest-audit.service"
import type { CreateQuestCompletionDto } from "./dto/create-quest-completion.dto"
import type { ReverseCompletionDto } from "./dto/reverse-completion.dto"
import type { QueryAuditDto } from "./dto/query-audit.dto"
import type { BulkAuditDto } from "./dto/bulk-audit.dto"

@Controller("quest-audit")
export class QuestAuditController {
  constructor(private readonly questAuditService: QuestAuditService) {}

  @Post("completions")
  async logCompletion(dto: CreateQuestCompletionDto) {
    return this.questAuditService.logCompletion(dto)
  }

  @Get("completions/duplicates")
  async detectDuplicates(userId: string, questId: string) {
    return this.questAuditService.detectDuplicates(userId, questId)
  }

  @Put("completions/reverse")
  async reverseCompletion(dto: ReverseCompletionDto) {
    return this.questAuditService.reverseCompletion(dto)
  }

  @Get("users/:userId/history")
  async getUserHistory(userId: string, limit?: number) {
    return this.questAuditService.getUserHistory(userId, limit)
  }

  @Get("alerts")
  async getAlerts(query: QueryAuditDto) {
    return this.questAuditService.getAlerts(query)
  }

  @Post("bulk")
  async bulkAudit(dto: BulkAuditDto) {
    return this.questAuditService.bulkAudit(dto)
  }

  @Get("patterns")
  async getExploitPatterns() {
    return this.questAuditService.getExploitPatterns()
  }

  @Get("dashboard")
  async getPatternDashboard() {
    return this.questAuditService.getPatternDashboard()
  }
}
