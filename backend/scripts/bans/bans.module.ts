import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BansService } from './bans.service';
import { BansController, ReportsController } from './bans.controller';
import { Ban } from './entities/ban.entity';
import { Report } from './entities/report.entity';
import { BanCheckGuard } from './guards/ban-check.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Ban, Report])],
  controllers: [BansController, ReportsController],
  providers: [BansService, BanCheckGuard],
  exports: [BansService, BanCheckGuard],
})
export class BansModule {}

// Database migration file: src/migrations/YYYYMMDDHHMMSS-create-bans-reports-tables.ts
import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateBansReportsTables1234567890123
  implements MigrationInterface
{
  name = 'CreateBansReportsTables1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create bans table
    await queryRunner.createTable(
      new Table({
        name: 'bans',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'bannedBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create reports table
    await queryRunner.createTable(
      new Table({
        name: 'reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'reporterId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'reportedUserId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'harassment',
              'spam',
              'inappropriate_content',
              'hate_speech',
              'scam',
              'other',
            ],
            isNullable: false,
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'evidence',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
            default: "'pending'",
          },
          {
            name: 'reviewedBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'reviewNotes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: '',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reports', true);
    await queryRunner.dropTable('bans', true);
  }
}
