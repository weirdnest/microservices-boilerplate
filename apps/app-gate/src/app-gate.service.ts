import { Injectable } from '@nestjs/common';

@Injectable()
export class AppGateService {
  getHello(): string {
    return 'Hello World!';
  }
}
