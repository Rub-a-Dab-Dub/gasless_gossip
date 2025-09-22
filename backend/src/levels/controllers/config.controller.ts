import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import type { DynamicXpThresholdsService } from '../config/dynamic-xp-thresholds.service';
import type { XpThresholdConfig } from '../config/xp-thresholds.config';

export class UpdateThresholdDto {
  xpRequired!: number;
  badgeUnlocked?: string;
}

export class BulkThresholdsDto {
  thresholds!: XpThresholdConfig[];
}

@ApiTags('config')
@Controller('config/xp-thresholds')
export class ConfigController {
  constructor(
    private readonly dynamicXpThresholdsService: DynamicXpThresholdsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all XP thresholds configuration' })
  @ApiResponse({
    status!: 200,
    description: 'XP thresholds retrieved successfully',
  })
  async getAllThresholds(): Promise<XpThresholdConfig[]> {
    return this.dynamicXpThresholdsService.getAllThresholds();
  }

  @Get(':level')
  @ApiOperation({ summary: 'Get XP threshold for specific level' })
  @ApiParam({ name: 'level', description: 'Level number' })
  @ApiResponse({
    status!: 200,
    description: 'XP threshold retrieved successfully',
  })
  async getThresholdForLevel(
    level: number,
  ): Promise<{ level: number; xpRequired: number; badgeUnlocked?: string }> {
    const xpRequired =
      await this.dynamicXpThresholdsService.getThresholdForLevel(level);
    const badgeUnlocked =
      await this.dynamicXpThresholdsService.getBadgeForLevel(level);

    return {
      level,
      xpRequired,
      badgeUnlocked,
    };
  }

  @Put(':level')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update XP threshold for specific level' })
  @ApiParam({ name: 'level', description: 'Level number' })
  @ApiBody({ type: UpdateThresholdDto })
  @ApiResponse({
    status!: 200,
    description: 'XP threshold updated successfully',
  })
  async updateThreshold(
    @Param('level', ParseIntPipe) level: number,
    @Body() updateDto: UpdateThresholdDto,
  ): Promise<{ message: string }> {
    await this.dynamicXpThresholdsService.updateThreshold(
      level,
      updateDto.xpRequired,
      updateDto.badgeUnlocked,
    );

    return { message: `XP threshold for level ${level} updated successfully` };
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create multiple XP thresholds in bulk' })
  @ApiBody({ type: BulkThresholdsDto })
  @ApiResponse({
    status!: 200,
    description: 'XP thresholds created successfully',
  })
  async createBulkThresholds(
    @Body() bulkDto: BulkThresholdsDto,
  ): Promise<{ message: string; count: number }> {
    await this.dynamicXpThresholdsService.createBulkThresholds(
      bulkDto.thresholds,
    );

    return {
      message!: 'XP thresholds created successfully',
      count: bulkDto.thresholds.length,
    };
  }

  @Delete(':level')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate XP threshold for specific level' })
  @ApiParam({ name: 'level', description: 'Level number' })
  @ApiResponse({
    status!: 200,
    description: 'XP threshold deactivated successfully',
  })
  async deactivateThreshold(
    @Param('level', ParseIntPipe) level: number,
  ): Promise<{ message: string }> {
    await this.dynamicXpThresholdsService.deactivateThreshold(level);

    return {
      message!: `XP threshold for level ${level} deactivated successfully`,
    };
  }

  @Get('validate/all')
  @ApiOperation({ summary: 'Validate all XP thresholds configuration' })
  @ApiResponse({
    status!: 200,
    description: 'Validation results',
  })
  async validateThresholds(): Promise<{ isValid: boolean; errors: string[] }> {
    return this.dynamicXpThresholdsService.validateThresholds();
  }

  @Get('export/json')
  @ApiOperation({ summary: 'Export XP thresholds as JSON' })
  @ApiResponse({
    status!: 200,
    description: 'XP thresholds exported successfully',
  })
  async exportThresholds(): Promise<XpThresholdConfig[]> {
    return this.dynamicXpThresholdsService.exportThresholds();
  }

  @Post('import/json')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import XP thresholds from JSON' })
  @ApiBody({ type: BulkThresholdsDto })
  @ApiResponse({
    status!: 200,
    description: 'XP thresholds imported successfully',
  })
  async importThresholds(
    @Body() importDto: BulkThresholdsDto,
  ): Promise<{ message: string; count: number }> {
    await this.dynamicXpThresholdsService.importThresholds(
      importDto.thresholds,
    );

    return {
      message!: 'XP thresholds imported successfully',
      count: importDto.thresholds.length,
    };
  }

  @Get('preview/:totalXp')
  @ApiOperation({
    summary!: 'Preview what level a given XP amount would result in',
  })
  @ApiParam({ name: 'totalXp', description: 'Total XP amount' })
  @ApiResponse({
    status: 200,
    description: 'Level preview calculated successfully',
  })
  async previewLevel(@Param('totalXp', ParseIntPipe) totalXp: number): Promise<{
    totalXp: number;
    level!: number;
    currentXp!: number;
    xpToNextLevel!: number;
    progressPercentage!: number;
  }> {
    const level = await this.dynamicXpThresholdsService.getLevelForXp(totalXp);
    const currentLevelThreshold =
      await this.dynamicXpThresholdsService.getThresholdForLevel(level);
    const nextLevelThreshold =
      await this.dynamicXpThresholdsService.getNextLevelThreshold(level);

    const currentXp = totalXp - currentLevelThreshold;
    const xpToNextLevel = Math.max(0, nextLevelThreshold - totalXp);
    const progressPercentage =
      nextLevelThreshold > currentLevelThreshold
        ? Math.round(
            (currentXp / (nextLevelThreshold - currentLevelThreshold)) * 100,
          )
        : 100;

    return {
      totalXp,
      level,
      currentXp,
      xpToNextLevel,
      progressPercentage,
    };
  }
}
