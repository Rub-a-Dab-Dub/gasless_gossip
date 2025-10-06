import { Module } from '@nestjs/common';
import { SwaggerDocsService } from './swagger-docs.service';
import { SwaggerDocsController } from './swagger-docs.controller';

@Module({
  controllers: [SwaggerDocsController],
  providers: [SwaggerDocsService],
})
export class SwaggerDocsModule {}