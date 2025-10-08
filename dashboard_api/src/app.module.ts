import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PseudonymModule } from './pseudonym/pseudonym.module';
import { WalletModule } from './wallet/wallet.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AdminModule } from './admin/admin.module';
import { AdminUsersModule } from './admin/user/admin-users.module';
import { SwaggerDocsModule } from './admin/swagger-docs/swagger-docs.module';
import { ReportsModule } from './reports/reports.module';
import { FinanceMetricsModule } from './finance-metrics/finance-metrics.module';
import { AdminCreatorModule } from './admin/creator/admin-creator.module';
import { RestoreProcedureModule } from './restore-procedure/restore-procedure.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    UserModule,
    PseudonymModule,
    WalletModule,
    AuditLogModule,
    AdminModule,
    AdminUsersModule,
    SwaggerDocsModule,
    ReportsModule,
    FinanceMetricsModule,
    AdminCreatorModule,
    RestoreProcedureModule,
  ],
})
export class AppModule {}
