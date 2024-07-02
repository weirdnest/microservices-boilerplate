import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { IArticlesRepo } from './interfaces/articles-repo.interface';
import { MockType } from '@libs/shared/abstract/specs';
import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { ArticleEntity } from './entities/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
// import { mockRepoFactory } from '@libs/shared/abstract/specs';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repo: MockType<IRepository<ArticleEntity>>;

  const mockRepo: MockType<IRepository<ArticleEntity>> = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: IArticlesRepo, useValue: mockRepo },
      ],
    }).compile();

    service = await module.resolve<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an article', async () => {
    const createArticleDto: CreateArticleDto = { title: 'Test Article' };
    mockRepo.create.mockResolvedValue(createArticleDto);
    expect(await service.create(createArticleDto)).toEqual(createArticleDto);
    expect(mockRepo.create).toHaveBeenCalledWith(createArticleDto);
  });

  it('should find many articles', async () => {
    const query = {};
    const result = [];
    mockRepo.findMany.mockResolvedValue({ data: result, count: 0 });
    expect(await service.findMany(query)).toEqual({ data: result, count: 0 });
    expect(mockRepo.findMany).toHaveBeenCalledWith(query);
  });

  it('should find one article', async () => {
    const query = {};
    const result = {};
    mockRepo.findOne.mockResolvedValue(result);
    expect(await service.findOne(query)).toEqual(result);
    expect(mockRepo.findOne).toHaveBeenCalledWith(query);
  });

  it('should update an article', async () => {
    const id = '1';
    const payload: UpdateArticleDto = { title: 'Updated Article' };
    mockRepo.update.mockResolvedValue(payload);
    expect(await service.update(id, payload)).toEqual(payload);
    expect(mockRepo.update).toHaveBeenCalledWith(id, payload);
  });

  it('should remove an article', async () => {
    const id = '1';
    const result = {};
    mockRepo.remove.mockResolvedValue(result);
    expect(await service.remove(id)).toEqual(result);
    expect(mockRepo.remove).toHaveBeenCalledWith(id);
  });
});
