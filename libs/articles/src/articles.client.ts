import { Inject, Injectable } from '@nestjs/common';
import { IArticlesService } from './interfaces/articles-service.interface';
import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article';
import {
  ServiceFindManyOptions,
  IFindManyResponse,
  ServiceFindOneOptions,
} from '@libs/shared/interfaces/repository.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { serviceRequest } from '@libs/shared/utils/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { ArticlesPatterns } from './constants';

@Injectable()
export class ArticlesClient implements IArticlesService {
  constructor(
    @Inject('ARTICLES_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  async create(
    body: CreateArticleDto,
    context?: IRequestContext,
  ): Promise<Article> {
    const result = (await serviceRequest(
      this.client,
      ArticlesPatterns.CREATE,
      body,
    )) as Article;
    return result;
  }

  async findMany(
    query: ServiceFindManyOptions<Article>,
    context?: IRequestContext,
  ): Promise<IFindManyResponse<Article>> {
    const result = (await serviceRequest(
      this.client,
      ArticlesPatterns.FIND_MANY,
      query,
    )) as IFindManyResponse<Article>;
    return result;
  }

  async findOne(
    query: ServiceFindOneOptions<Article>,
    context?: IRequestContext,
  ): Promise<Article> {
    const result = (await serviceRequest(
      this.client,
      ArticlesPatterns.FIND_ONE,
      query,
    )) as Article;
    return result;
  }

  async update(
    id: string | string[],
    payload: UpdateArticleDto,
    context?: IRequestContext,
  ): Promise<Article | Article[]> {
    const result = (await serviceRequest(this.client, ArticlesPatterns.UPDATE, {
      ...payload,
      id,
    })) as Article;
    return result;
  }

  async remove(
    id: string | string[],
    context?: IRequestContext,
  ): Promise<Omit<Article, 'id'> | Omit<Article, 'id'>[]> {
    const result = (await serviceRequest(this.client, ArticlesPatterns.REMOVE, {
      id,
    })) as Article;
    return result;
  }
}
