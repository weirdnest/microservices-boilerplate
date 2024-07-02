import { IConfigService } from '@libs/shared/interfaces/config-service.interface';
import {
  ConsoleLogger,
  Inject,
  Injectable,
  LogLevel,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import * as _ from 'lodash';
import { ILogger } from './interfaces/logger.interface';
import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger implements ILogger {
  constructor(
    private moduleRef: ModuleRef, // configService: ConfigService, // @Inject(IConfigService) private readonly configService: IConfigService,
  ) {
    super();
    let logLevels: LogLevel[] = ['error', 'warn', 'log', 'verbose', 'debug'];
    const env = process.env.NODE_ENV;
    const isTestEnv = env === 'test';
    const isDevEnv = env === 'develop';
    const isProdEnv = env === 'production';
    if (isTestEnv) {
      logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];
    }
    super.setLogLevels(logLevels);
  }

  withContext(method: string, context?: IRequestContext): ILogger {
    const contextId = context?.get('id') || '';
    const dto = context?.get('dto') || undefined;
    return {
      log: this.log,
      error: this.error,
      warn: this.warn,
      verbose: (msg, ...optionalParams: any[]) => {
        return super.verbose(
          this.stringify(msg, ...optionalParams),
          `${this.context}.${method}:${contextId}`,
        );
      },
      debug: this.debug,
    } as ILogger;
  }

  /**
   * Write a 'log' level log, if the configured level allows for it. Prints to stdout with newline.
   * @param msg message to log
   * @param optionalParams other params to include, last one will be added to context
   */
  log(msg: any, ...optionalParams: any[]) {
    super.log(this.stringify(msg, ...optionalParams));
  }

  /*
   * Write an 'error' level log, if the configured level allows for it. Prints to stderr with newline.
   * @param message message to log
   * @param optionalParams other params to include, last one will be added to context
   */
  error(msg: any, ...optionalParams: any[]) {
    super.error(this.stringify(msg, ...optionalParams));
  }

  /**
   * Write an 'warn' level log, if the configured level allows for it. Prints to stderr with newline.
   * @param message message to log
   * @param optionalParams other params to include, last one will be added to context
   */
  warn(msg: any, ...optionalParams: any[]) {
    super.warn(this.stringify(msg, ...optionalParams));
  }

  /**
   * Write an 'debug' level log, if the configured level allows for it. Prints to stderr with newline.
   * @param message message to log
   * @param optionalParams other params to include, last one will be added to context
   */
  debug(msg: any, ...optionalParams: any[]) {
    super.debug(this.stringify(msg, ...optionalParams));
  }

  /**
   * Write an 'verbose' level log, if the configured level allows for it. Prints to stderr with newline.
   * @param message message to log
   * @param optionalParams other params to include, last one will be added to context
   */
  verbose(msg: any, ...optionalParams: any[]) {
    super.verbose(this.stringify(msg, ...optionalParams));
  }

  stringify(message, ...optionalParams: any[]) {
    const paramStrings: string[] = [];
    [message, ...optionalParams].map((param: any) => {
      let paramString = '';
      if (typeof param === 'string') {
        paramString = param;
      } else if (typeof param == 'number') {
        paramString = _.toString(param);
      } else if (typeof param === 'object') {
        try {
          paramString = JSON.stringify(param);
        } catch (ignored) {
          paramString = _.toString(param);
        }
      }
      paramStrings.push(paramString);
    });

    return paramStrings.join(' ');
  }
}
