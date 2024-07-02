import { IRequestContext } from '@libs/shared/modules/request-context/interfaces/request-context-service.interface';
import { ConsoleLogger } from '@nestjs/common';

export interface ILogger extends ConsoleLogger {
  log(msg: any, ...optionalParams: any[]): void;
  error(msg: any, ...optionalParams: any[]): void;
  warn(msg: any, ...optionalParams: any[]): void;
  debug(msg: any, ...optionalParams: any[]): void;
  verbose(msg: any, ...optionalParams: any[]): void;

  withContext(method: string, requestContext?: IRequestContext): ILogger;
}
export const ILogger = Symbol('ILogger');
