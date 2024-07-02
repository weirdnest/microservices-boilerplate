import { ConfigService as BaseConfigService } from '@nestjs/config';

export interface IConfigService extends BaseConfigService {}
export const IConfigService = Symbol('IConfigService');
