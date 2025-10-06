import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';

// Implement your auth guard
// @UseGuards(AdminAuthGuard)
@Controller('admin/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  // READ: Get all configuration (masked)
  @Get()
  getAllConfig() {
    return {
      environment: this.configService.app.nodeEnv,
      config: this.configService.getAllConfig(),
    };
  }

  // READ: Validate configuration
  @Get('validate')
  validateConfig() {
    return this.configService.validateConfig();
  }

  // READ: Get audit log
  @Get('audit')
  getAuditLog() {
    return this.configService.getAuditLog();
  }

  // UPDATE: Runtime configuration update
  @Put(':key')
  @HttpCode(HttpStatus.OK)
  updateConfig(
    @Param('key') key: string,
    @Body() body: { value: any; changedBy?: string },
  ) {
    this.configService.updateConfig(key, body.value, body.changedBy || 'admin');
    return {
      message: 'Configuration updated successfully',
      key,
      value: body.value,
    };
  }

  // DELETE: Rotate secret
  @Delete('secret/:key')
  @HttpCode(HttpStatus.OK)
  async rotateSecret(
    @Param('key') key: string,
    @Body() body: { newValue: string; changedBy?: string },
  ) {
    await this.configService.rotateSecret(
      key,
      body.newValue,
      body.changedBy || 'admin',
    );
    return {
      message: 'Secret rotated successfully',
      key,
    };
  }
}

