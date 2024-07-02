import { ILogger } from "./interfaces/logger.interface";
import { Logger } from "./logger.service";

export const LoggerProvider = {
  provide: ILogger,
  useClass: Logger,
};
