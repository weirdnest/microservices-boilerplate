import { Module } from '@nestjs/common';
import { ArticlesClientProvider } from './providers/articles-client.provider';
import { ArticlesRestController } from './articles.controller.rest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RequestContextProvider } from '@libs/shared/modules/request-context/providers/request-context.provider';
import * as Joi from 'joi';
import { ArticlesGateway } from './articles.gateway';

@Module({
  controllers: [ArticlesRestController],
  exports: [ArticlesClientProvider],
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASS: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_PROTO: Joi.string().required(),
        QUEUE_CONTENT: Joi.string().required(),
      }),
    }),
  ],
  providers: [
    ArticlesClientProvider,
    RequestContextProvider,
    ArticlesGateway,
    {
      provide: 'ARTICLES_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASS');
        const host = configService.get('RABBITMQ_HOST');
        const proto = configService.get('RABBITMQ_PROTO') || 'amqp';
        const queueName = configService.get('QUEUE_CONTENT') || `queue_content`;

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`${proto}://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class ArticlesClientModule {}
