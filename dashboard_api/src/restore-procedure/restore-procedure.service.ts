import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../shared/s3/s3.service';
import { LoggerService } from '../logger/logger.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

@Injectable()
export class RestoreProcedureService {
  private readonly backupPath: string;
  private readonly logger = new Logger(RestoreProcedureService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly loggerService: LoggerService,
  ) {
    this.backupPath = this.configService.get<string>('BACKUP_PATH', '/tmp/whspr-backups');
    this.initBackupDirectory();
  }

  private async initBackupDirectory() {
    try {
      await fs.mkdir(this.backupPath, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create backup directory: ${error.message}`);
      throw error;
    }
  }

  async createBackup(dryRun = false): Promise<{ backupId: string; size: number }> {
    const timestamp = new Date().toISOString();
    const backupId = `backup-${timestamp}`;
    const filename = `${backupId}.sql`;
    const localPath = path.join(this.backupPath, filename);

    try {
      if (dryRun) {
        this.logger.log(`[DRY RUN] Would create backup: ${filename}`);
        return { backupId, size: 0 };
      }

      // Execute pg_dump
      const { stdout, stderr } = await execAsync(
        `PGPASSWORD=${this.configService.get('DB_PASSWORD')} pg_dump -h ${this.configService.get('DB_HOST')} -U ${this.configService.get('DB_USER')} -d ${this.configService.get('DB_NAME')} -F c -f ${localPath}`,
      );

      if (stderr) {
        this.logger.warn(`pg_dump warnings: ${stderr}`);
      }

      // Calculate file size and checksum
      const stats = await fs.stat(localPath);
      const checksum = await this.calculateChecksum(localPath);

      // Upload to S3
      await this.s3Service.uploadFile(localPath, `backups/${filename}`, {
        metadata: {
          checksum,
          timestamp,
        },
      });

      // Log backup details
      await this.loggerService.log('backup-created', {
        backupId,
        size: stats.size,
        checksum,
        timestamp,
      });

      // Cleanup local file
      await fs.unlink(localPath);

      return { backupId, size: stats.size };
    } catch (error) {
      this.logger.error(`Backup creation failed: ${error.message}`);
      throw error;
    }
  }

  async listBackups(): Promise<Array<{
    id: string;
    size: number;
    timestamp: string;
    status: string;
  }>> {
    try {
      const backups = await this.s3Service.listFiles('backups/');
      return backups.map((backup) => ({
        id: path.basename(backup.Key, '.sql'),
        size: backup.Size,
        timestamp: backup.Metadata?.timestamp || backup.LastModified.toISOString(),
        status: backup.Metadata?.status || 'available',
      }));
    } catch (error) {
      this.logger.error(`Failed to list backups: ${error.message}`);
      throw error;
    }
  }

  async verifyBackup(backupId: string): Promise<{
    isValid: boolean;
    details: { size: number; checksum: string };
  }> {
    const filename = `${backupId}.sql`;
    const localPath = path.join(this.backupPath, filename);

    try {
      // Download backup from S3
      await this.s3Service.downloadFile(`backups/${filename}`, localPath);

      // Calculate new checksum
      const newChecksum = await this.calculateChecksum(localPath);
      const originalChecksum = await this.s3Service.getFileMetadata(
        `backups/${filename}`,
        'checksum',
      );

      // Verify database restore in dry-run mode
      const isRestoreValid = await this.verifyRestore(localPath);

      // Cleanup
      await fs.unlink(localPath);

      const stats = await fs.stat(localPath);
      return {
        isValid: newChecksum === originalChecksum && isRestoreValid,
        details: {
          size: stats.size,
          checksum: newChecksum,
        },
      };
    } catch (error) {
      this.logger.error(`Backup verification failed: ${error.message}`);
      throw error;
    }
  }

  async restoreBackup(backupId: string, dryRun = false): Promise<{
    success: boolean;
    duration: number;
  }> {
    const filename = `${backupId}.sql`;
    const localPath = path.join(this.backupPath, filename);
    const startTime = Date.now();

    try {
      if (dryRun) {
        this.logger.log(`[DRY RUN] Would restore backup: ${filename}`);
        return { success: true, duration: 0 };
      }

      // Download backup
      await this.s3Service.downloadFile(`backups/${filename}`, localPath);

      // Verify backup before restore
      const { isValid } = await this.verifyBackup(backupId);
      if (!isValid) {
        throw new Error('Backup verification failed before restore');
      }

      // Perform restore
      await this.executeRestore(localPath);

      // Verify after restore
      const postRestoreValid = await this.verifyRestore(localPath);
      if (!postRestoreValid) {
        throw new Error('Post-restore verification failed');
      }

      // Cleanup
      await fs.unlink(localPath);

      const duration = Date.now() - startTime;
      await this.loggerService.log('backup-restored', {
        backupId,
        duration,
        timestamp: new Date().toISOString(),
      });

      return { success: true, duration };
    } catch (error) {
      this.logger.error(`Restore failed: ${error.message}`);
      throw error;
    }
  }

  async pruneOldBackups(retentionDays: number): Promise<{
    deletedCount: number;
    freedSpace: number;
  }> {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const toDelete = backups.filter(
        (backup) => new Date(backup.timestamp) < cutoffDate,
      );

      let freedSpace = 0;
      for (const backup of toDelete) {
        await this.s3Service.deleteFile(`backups/${backup.id}.sql`);
        freedSpace += backup.size;
      }

      await this.loggerService.log('backups-pruned', {
        count: toDelete.length,
        freedSpace,
        timestamp: new Date().toISOString(),
      });

      return {
        deletedCount: toDelete.length,
        freedSpace,
      };
    } catch (error) {
      this.logger.error(`Failed to prune backups: ${error.message}`);
      throw error;
    }
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(filePath);

      stream.on('error', (error) => reject(error));
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  private async verifyRestore(backupPath: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(
        `pg_restore --list ${backupPath}`,
      );
      return stdout.length > 0;
    } catch (error) {
      this.logger.error(`Restore verification failed: ${error.message}`);
      return false;
    }
  }

  private async executeRestore(backupPath: string): Promise<void> {
    try {
      await execAsync(
        `PGPASSWORD=${this.configService.get('DB_PASSWORD')} pg_restore -h ${this.configService.get('DB_HOST')} -U ${this.configService.get('DB_USER')} -d ${this.configService.get('DB_NAME')} -c ${backupPath}`,
      );
    } catch (error) {
      throw new Error(`Database restore failed: ${error.message}`);
    }
  }
}