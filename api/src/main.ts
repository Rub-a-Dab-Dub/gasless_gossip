import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseService } from './common/services/response.service';
import { RoomCategoriesSeeder } from './room-categories/room-categories.seeder';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  const responseService = app.get(ResponseService);
  app.useGlobalFilters(new AllExceptionsFilter(responseService));
  const seeder = app.get(RoomCategoriesSeeder);
  await seeder.seed();
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
