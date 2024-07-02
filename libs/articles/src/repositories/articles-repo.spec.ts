import { ArticlesRepo } from './articles.repo';

describe('ArticlesRepository', () => {
  it('should be defined', () => {
    expect(new ArticlesRepo()).toBeDefined();
  });
});
