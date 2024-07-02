import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesGateway } from './articles.gateway';
import { ArticlesService } from './articles.service';

describe('ArticlesGateway', () => {
  let gateway: ArticlesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesGateway, ArticlesService],
    }).compile();

    gateway = module.get<ArticlesGateway>(ArticlesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
