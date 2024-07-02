import { ArticlesClient } from '../articles.client';
import { IArticlesService } from '../interfaces/articles-service.interface';

export const ArticlesClientProvider = {
  provide: IArticlesService,
  useClass: ArticlesClient,
};
