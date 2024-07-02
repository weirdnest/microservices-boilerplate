import { ServiceInterface } from '@libs/shared/interfaces/service.interface';
import { Article } from '../entities/article';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

export const IArticlesService = Symbol('IArticlesService');
export interface IArticlesService
  extends ServiceInterface<Article, CreateArticleDto, UpdateArticleDto> {}
