import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CsrfProtectionService } from './csrf-protection.service';
import { CsrfProtectionController } from './csrf-protection.controller';
import { CsrfValidationMiddleware } from './middleware/csrf-validation.middleware';

@Module({
  providers: [CsrfProtectionService],
  controllers: [CsrfProtectionController],
  exports: [CsrfProtectionService],
})
export class CsrfProtectionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfValidationMiddleware)
      .forRoutes(
        { path: 'auth/login', method: RequestMethod.POST },
        // Add other protected routes here
      );
  }
}