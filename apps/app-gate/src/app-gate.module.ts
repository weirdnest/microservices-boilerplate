import { Module } from '@nestjs/common';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RequestContextProvider } from '@libs/shared/modules/request-context/providers/request-context.provider';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';
import { AppGateController } from './app-gate.controller';
import { AppGateService } from './app-gate.service';
import { ArticlesClientModule } from '@libs/articles/articles-client.module';

const user = process.env.RABBITMQ_USER;
const password = process.env.RABBITMQ_PASS;
const host = process.env.RABBITMQ_HOST;
const proto = process.env.RABBITMQ_PROTO;
const queueName = process.env.QUEUE_USERS;
const url = `${proto}://${user}:${password}@${host}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASS: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_PROTO: Joi.string().required(),
        QUEUE_USERS: Joi.string().required(),
      }),
    }),

    ArticlesClientModule,
  ],
  controllers: [AppGateController],
  providers: [
    //
    AppGateService,
    RequestContextProvider,
    ConfigServiceProvider,

    {
      provide: 'USERS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASS');
        const host = configService.get('RABBITMQ_HOST');
        const proto = configService.get('RABBITMQ_PROTO') || 'amqp';
        const queueName = configService.get('QUEUE_USERS') || `queue_users`;

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
export class AppGateModule {}
