import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from './logger.service';
import { LoggerProvider } from './constants';
import { ILogger } from './interfaces/logger.interface';
import { ConfigServiceProvider } from '../config';

describe('Logger', () => {
  let service: ILogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerProvider,
        ConfigServiceProvider,
      ],
    }).compile();

    service = await module.resolve<Logger>(ILogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
