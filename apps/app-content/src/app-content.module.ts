import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@libs/articles/entities/article.entity';
import { ArticlesModule } from '@libs/articles';

@Module({
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

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get('NODE_ENV');
        const isDevEnv = env === 'develop';
        const isTestEnv = env === 'test';
        const synchronize = isDevEnv || isTestEnv ? true : false;
        const database = isTestEnv
          ? configService.get('POSTGRES_DB_TEST') ||
            `${configService.get('POSTGRES_DB')}-test`
          : configService.get('POSTGRES_DB');
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database,
          namingStrategy: new SnakeNamingStrategy(),
          entities: [ArticleEntity],
          synchronize,
        };
      },
    }),

    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppContentModule {}
