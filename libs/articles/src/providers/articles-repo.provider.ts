import { IArticlesRepo } from '../interfaces/articles-repo.interface';
import { ArticlesRepo } from '../repositories/articles.repo';

export const ArticlesRepoProvider = {
  provide: IArticlesRepo,
  useClass: ArticlesRepo,
};
