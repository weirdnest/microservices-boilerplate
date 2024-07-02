import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { ArticleEntity } from '../entities/article.entity';

export const IArticlesRepo = Symbol('IArticlesRepo');
export interface IArticlesRepo extends IRepository<ArticleEntity> {}
