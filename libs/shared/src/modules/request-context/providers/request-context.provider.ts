import { IRequestContext } from '../interfaces/request-context-service.interface';
import { RequestContextService } from '../request-context.service';

export const RequestContextProvider = {
  provide: IRequestContext,
  useClass: RequestContextService,
};
