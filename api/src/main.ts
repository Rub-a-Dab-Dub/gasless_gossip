import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseService } from './common/services/response.service';
import { CommandFactory } from 'nest-commander';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { setupDocumentationServer } from './infrastructure/documentation';

dotenv.config();

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  forceCloseConnections: true,
  rawBody: true,
});
  app.enableShutdownHooks();
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
      'https://gaslessgossip.xyz',
      'http://gaslessgossip.xyz',
      'https://www.gaslessgossip.xyz',
      'http://www.gaslessgossip.xyz',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  const responseService = app.get(ResponseService);
  app.useGlobalFilters(new AllExceptionsFilter(responseService));

  app.useStaticAssets(join(__dirname, '..', 'src', 'assets', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'assets', 'views'));
  app.setViewEngine('hbs');
  setupDocumentationServer(app);

  // app.use('/static', express.static(join(__dirname, '..', 'public')));
  app.useLogger(app.get(Logger));

  await app.listen(Number(process.env.PORT));
  await CommandFactory.run(AppModule);
}
bootstrap();
