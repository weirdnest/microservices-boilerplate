import { Inject, Injectable } from '@nestjs/common';
import { IArticlesService } from './interfaces/articles-service.interface';
import { IArticlesRepo } from './interfaces/articles-repo.interface';
import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article';
import {
  ServiceFindManyOptions,
  IFindManyResponse,
  ServiceFindOneOptions,
} from '@libs/shared/interfaces/repository.interface';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService implements IArticlesService {
  constructor(@Inject(IArticlesRepo) private readonly repo: IArticlesRepo) {}
  async create(
    body: CreateArticleDto,
    context?: IRequestContext,
  ): Promise<Article> {
    return await this.repo.create(body);
  }

  async findMany(
    query: ServiceFindManyOptions<Article>,
    context?: IRequestContext,
  ): Promise<IFindManyResponse<Article>> {
    return await this.repo.findMany(query);
  }

  async findOne(
    query: ServiceFindOneOptions<Article>,
    context?: IRequestContext,
  ): Promise<Article> {
    return await this.repo.findOne(query);
  }

  async update(
    id: string | string[],
    payload: UpdateArticleDto,
    context?: IRequestContext,
  ): Promise<Article | Article[]> {
    return await this.repo.update(id, payload);
  }

  async remove(
    id: string | string[],
    context?: IRequestContext,
  ): Promise<Article | Article[]> {
    return await this.repo.remove(id);
  }
}
