import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { LoggerProvider } from './constants';

@Module({
  providers: [Logger, LoggerProvider],
  exports: [Logger, LoggerProvider],
})
export class LoggerModule { }
