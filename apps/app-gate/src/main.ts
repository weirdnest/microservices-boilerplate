import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@libs/shared/exceptions';
import { AppGateModule } from './app-gate.module';

async function bootstrap() {
  const app = await NestFactory.create(AppGateModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(process.env.API_PREFIX || '');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
