export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
  refreshSecret: string;
  refreshExpiration: string;
}

export interface AwsConfig {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  s3Bucket?: string;
}

export interface EmailConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
}

export interface SecurityConfig {
  rateLimitTtl: number;
  rateLimitMax: number;
  corsOrigin: string;
}

export interface MonitoringConfig {
  logLevel: string;
}

export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
    apiPrefix: process.env.API_PREFIX,
  } as AppConfig,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  } as DatabaseConfig,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
  } as RedisConfig,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  } as JwtConfig,
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET,
  } as AwsConfig,
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  } as EmailConfig,
  security: {
    rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL, 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10),
    corsOrigin: process.env.CORS_ORIGIN,
  } as SecurityConfig,
  monitoring: {
    logLevel: process.env.LOG_LEVEL,
  } as MonitoringConfig,
});

