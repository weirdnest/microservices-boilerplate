import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesClient } from './articles.client';
import { CreateArticleDto } from './dto/create-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesClient],
    }).compile();

    service = await module.resolve<ArticlesClient>(ArticlesClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createArticleDto: CreateArticleDto = { title: 'Test Article' };
    const article = { id: '1', title: 'Test Article' };
    let serviceRequestSpy;

    // beforeEach(() => {
    //   serviceRequestSpy = jest
    //     .spyOn(serviceRequestModule, 'serviceRequest')
    //     .mockResolvedValue(article);
    // });

    // afterEach(() => {
    //   jest.resetAllMocks();
    // });

    // it('should call serviceRequest with CREATE pattern and correct arguments', async () => {
    //   const result = await articlesClient.create(createArticleDto);
    //   expect(serviceRequestSpy).toHaveBeenCalledWith(
    //     clientProxy,
    //     ArticlesPatterns.CREATE,
    //     createArticleDto,
    //   );
    //   expect(result).toEqual(article);
    // });
  });
});
