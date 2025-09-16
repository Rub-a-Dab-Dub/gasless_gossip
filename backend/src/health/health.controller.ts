import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('db')
  async checkDb() {
    try {
      // Simple query to check DB connection
      await this.dataSource.query('SELECT 1');
      return { status: 'DB Connected' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        { status: 'DB Connection Failed', message: errorMessage },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
