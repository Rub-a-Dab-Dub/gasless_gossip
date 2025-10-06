import { Controller, Get, Put, Delete, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerDocsService } from './swagger-docs.service';

@ApiTags('Swagger Docs')
@Controller('admin/swagger-docs')
export class SwaggerDocsController {
  constructor(private readonly swaggerDocsService: SwaggerDocsService) {}

  @Get('export')
  @ApiOperation({ summary: 'Export OpenAPI specification' })
  @ApiResponse({ status: 200, description: 'OpenAPI JSON returned' })
  exportOpenApi() {
    return this.swaggerDocsService.getDocument();
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get tag groups' })
  @ApiResponse({ status: 200, description: 'List of tags' })
  getTags() {
    return this.swaggerDocsService.getTags();
  }

  @Put('examples')
  @ApiOperation({ summary: 'Update example payloads' })
  @ApiResponse({ status: 200, description: 'Examples updated' })
  updateExamples(@Body() examples: any) {
    return this.swaggerDocsService.updateExamples(examples);
  }

  @Delete('versions/:version')
  @ApiOperation({ summary: 'Delete version control' })
  @ApiResponse({ status: 200, description: 'Version deleted' })
  deleteVersion(@Param('version') version: string) {
    return this.swaggerDocsService.deleteVersion(version);
  }

  @Post('auth/simulate')
  @ApiOperation({ summary: 'Simulate authentication' })
  @ApiResponse({ status: 200, description: 'Auth simulated' })
  simulateAuth(@Body() body: { token: string }) {
    return this.swaggerDocsService.simulateAuth(body.token);
  }
}