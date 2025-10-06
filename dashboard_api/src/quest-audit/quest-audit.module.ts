import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { QuestAuditController } from "./quest-audit.controller"
import { QuestAuditService } from "./quest-audit.service"
import { QuestCompletion } from "./entities/quest-completion.entity"
import { ExploitPattern } from "./entities/exploit-pattern.entity"
import { AuditAlert } from "./entities/audit-alert.entity"

@Module({
  imports: [TypeOrmModule.forFeature([QuestCompletion, ExploitPattern, AuditAlert])],
  controllers: [QuestAuditController],
  providers: [QuestAuditService],
  exports: [QuestAuditService],
})
export class QuestAuditModule {}
