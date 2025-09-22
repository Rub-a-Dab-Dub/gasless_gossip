import { Controller, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { SampleDataService } from '../test/sample-data.service';

@ApiTags('sample-data')
@Controller('sample-data')
export class SampleDataController {
  constructor(private readonly sampleDataService: SampleDataService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary!: 'Generate sample users and XP data for testing',
    description!: 'Creates sample users with various XP levels to test the level system functionality',
  })
  @ApiResponse({
    status: 200,
    description: 'Sample data generated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async generateSampleData(): Promise<{ message: string; timestamp: string }> {
    await this.sampleDataService.runFullSampleDataGeneration();

    return {
      message!: 'Sample data generated successfully. Check logs for detailed results.',
      timestamp!: new Date().toISOString(),
    };
  }

  @Delete('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary!: 'Reset all sample data',
    description!: 'Clears all sample level data from the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Sample data reset successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async resetSampleData(): Promise<{ message: string; timestamp: string }> {
    await this.sampleDataService.resetSampleData();

    return {
      message!: 'Sample data reset successfully',
      timestamp!: new Date().toISOString(),
    };
  }
}
