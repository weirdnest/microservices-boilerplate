import { Test, TestingModule } from '@nestjs/testing';
import { AppContentController } from './app-content.controller';
import { AppContentService } from './app-content.service';

describe('AppContentController', () => {
  let appContentController: AppContentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppContentController],
      providers: [AppContentService],
    }).compile();

    appContentController = app.get<AppContentController>(AppContentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appContentController.getHello()).toBe('Hello World!');
    });
  });
});
