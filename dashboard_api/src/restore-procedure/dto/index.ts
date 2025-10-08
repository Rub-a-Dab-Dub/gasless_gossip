import { IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBackupDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Run in dry-run mode', default: false })
  dryRun?: boolean = false;
}

export class RestoreBackupDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Run in dry-run mode', default: false })
  dryRun?: boolean = false;
}

export class PruneBackupsDto {
  @IsInt()
  @Min(1)
  @Max(365)
  @ApiPropertyOptional({
    description: 'Number of days to retain backups',
    default: 30,
  })
  retentionDays: number = 30;
}