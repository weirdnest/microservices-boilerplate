import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { MicroserviceExceptionFilter } from '@libs/shared/exceptions/filters/microservice-exception.filter';
import { AppContentModule } from './app-content.module';

async function bootstrap() {
  const transportUrl = `${process.env.RABBITMQ_PROTO || 'amqp'}://${
    process.env.RABBITMQ_USER
  }:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`;

  const appService = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppContentModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [transportUrl],
        queue: `${process.env.QUEUE_CONTENT || 'queue_content'}`,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  appService.useGlobalPipes(new ValidationPipe());
  appService.useGlobalFilters(new MicroserviceExceptionFilter());
  await appService.listen();
}
bootstrap();
