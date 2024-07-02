import {
  AbstractRepository,
  AbstractRepositoryRequestParams,
} from '@libs/shared/abstract/abstract.repository';
import { IArticlesRepo } from '../interfaces/articles-repo.interface';
import { ArticleEntity } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesRepo
  extends AbstractRepository<ArticleEntity>
  implements IArticlesRepo
{
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repo: Repository<ArticleEntity>,
  ) {
    super(repo);
  }

  getRepository(
    params?: AbstractRepositoryRequestParams,
  ): Repository<ArticleEntity> {
    const { entityManager } = params || {};
    if (entityManager) {
      return entityManager.getRepository(ArticleEntity);
    }
    return this.repository;
  }
}
