import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  AppConfig,
  DatabaseConfig,
  RedisConfig,
  JwtConfig,
  AwsConfig,
  EmailConfig,
  SecurityConfig,
  MonitoringConfig,
} from './configuration';

@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly logger = new Logger(ConfigService.name);
  private configAuditLog: Array<{
    timestamp: Date;
    key: string;
    oldValue: any;
    newValue: any;
    changedBy: string;
  }> = [];

  constructor(private nestConfigService: NestConfigService) {}

  onModuleInit() {
    this.logger.log('Configuration loaded and validated successfully');
    this.logger.log(`Environment: ${this.app.nodeEnv}`);
    this.logger.log(`Port: ${this.app.port}`);
  }

  // ========== READ OPERATIONS ==========

  get app(): AppConfig {
    return this.nestConfigService.get<AppConfig>('app');
  }

  get database(): DatabaseConfig {
    return this.nestConfigService.get<DatabaseConfig>('database');
  }

  get redis(): RedisConfig {
    return this.nestConfigService.get<RedisConfig>('redis');
  }

  get jwt(): JwtConfig {
    return this.nestConfigService.get<JwtConfig>('jwt');
  }

  get aws(): AwsConfig {
    return this.nestConfigService.get<AwsConfig>('aws');
  }

  get email(): EmailConfig {
    return this.nestConfigService.get<EmailConfig>('email');
  }

  get security(): SecurityConfig {
    return this.nestConfigService.get<SecurityConfig>('security');
  }

  get monitoring(): MonitoringConfig {
    return this.nestConfigService.get<MonitoringConfig>('monitoring');
  }

  // Generic getter with fallback
  getOrDefault<T>(key: string, defaultValue: T): T {
    return this.nestConfigService.get<T>(key, defaultValue);
  }
