import { Test, TestingModule } from '@nestjs/testing';
import { RestoreProcedureService } from './restore-procedure.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../shared/s3/s3.service';
import { LoggerService } from '../logger/logger.service';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');
jest.mock('child_process');

describe('RestoreProcedureService', () => {
  let service: RestoreProcedureService;
  let configService: ConfigService;
  let s3Service: S3Service;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestoreProcedureService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              switch (key) {
                case 'BACKUP_PATH':
                  return '/tmp/test-backups';
                case 'DB_PASSWORD':
                  return 'test-password';
                case 'DB_HOST':
                  return 'localhost';
                case 'DB_USER':
                  return 'test-user';
                case 'DB_NAME':
                  return 'test-db';
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            downloadFile: jest.fn(),
            listFiles: jest.fn(),
            getFileMetadata: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestoreProcedureService>(RestoreProcedureService);
    configService = module.get<ConfigService>(ConfigService);
    s3Service = module.get<S3Service>(S3Service);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBackup', () => {
    it('should create backup in dry-run mode', async () => {
      const result = await service.createBackup(true);
      expect(result).toHaveProperty('backupId');
      expect(result).toHaveProperty('size', 0);
    });

    it('should create actual backup successfully', async () => {
      const mockStats = { size: 1024 };
      (fs.stat as jest.Mock).mockResolvedValue(mockStats);
      
      const result = await service.createBackup();
      
      expect(result).toHaveProperty('backupId');
      expect(result).toHaveProperty('size', 1024);
      expect(s3Service.uploadFile).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalled();
    });
  });

  describe('listBackups', () => {
    it('should list available backups', async () => {
      const mockBackups = [
        {
          Key: 'backups/test-backup.sql',
          Size: 1024,
          LastModified: new Date(),
          Metadata: { timestamp: '2025-10-08T00:00:00Z' },
        },
      ];

      (s3Service.listFiles as jest.Mock).mockResolvedValue(mockBackups);

      const result = await service.listBackups();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'test-backup');
      expect(result[0]).toHaveProperty('size', 1024);
      expect(s3Service.listFiles).toHaveBeenCalledWith('backups/');
    });
  });

  describe('verifyBackup', () => {
    it('should verify backup integrity', async () => {
      const mockStats = { size: 1024 };
      (fs.stat as jest.Mock).mockResolvedValue(mockStats);
      (s3Service.getFileMetadata as jest.Mock).mockResolvedValue('test-checksum');

      const result = await service.verifyBackup('test-backup');
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('details');
      expect(result.details).toHaveProperty('size', 1024);
      expect(s3Service.downloadFile).toHaveBeenCalled();
    });
  });

  describe('pruneOldBackups', () => {
    it('should prune backups older than retention period', async () => {
      const mockBackups = [
        {
          id: 'old-backup',
          size: 1024,
          timestamp: '2024-10-08T00:00:00Z',
          status: 'available',
        },
      ];

      (s3Service.listFiles as jest.Mock).mockResolvedValue(mockBackups);

      const result = await service.pruneOldBackups(30);
      
      expect(result).toHaveProperty('deletedCount', 1);
      expect(result).toHaveProperty('freedSpace', 1024);
      expect(s3Service.deleteFile).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalled();
    });
  });
});