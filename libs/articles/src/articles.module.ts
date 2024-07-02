import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesRmqController } from './articles.controller.rmq';
import { ArticlesServiceProvider } from './providers/articles-service.provider';
import { ArticlesRepoProvider } from './providers/articles-repo.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { RequestContextProvider } from '@libs/shared/modules/request-context/providers/request-context.provider';

@Module({
  controllers: [ArticlesRmqController],
  exports: [ArticlesServiceProvider],
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  providers: [
    ArticlesServiceProvider,
    ArticlesRepoProvider,
    RequestContextProvider,
  ],
})
export class ArticlesModule {}
