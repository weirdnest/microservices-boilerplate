import { ArticlesService } from '../articles.service';
import { IArticlesService } from '../interfaces/articles-service.interface';

export const ArticlesServiceProvider = {
  provide: IArticlesService,
  useClass: ArticlesService,
};
