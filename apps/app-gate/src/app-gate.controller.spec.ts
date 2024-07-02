import { Test, TestingModule } from '@nestjs/testing';
import { AppGateController } from './app-gate.controller';
import { AppGateService } from './app-gate.service';

describe('AppGateController', () => {
  let appGateController: AppGateController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppGateController],
      providers: [AppGateService],
    }).compile();

    appGateController = app.get<AppGateController>(AppGateController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appGateController.getHello()).toBe('Hello World!');
    });
  });
});
