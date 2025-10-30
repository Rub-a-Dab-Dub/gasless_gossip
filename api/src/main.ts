import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseService } from './common/services/response.service';
import { RoomCategoriesSeeder } from './room-categories/room-categories.seeder';
import { CommandFactory } from 'nest-commander';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const seeder = app.get(RoomCategoriesSeeder);
  await seeder.seed();
  await app.listen(Number(process.env.PORT));
  await CommandFactory.run(AppModule);
}
bootstrap();
