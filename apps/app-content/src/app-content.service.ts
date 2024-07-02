import { Injectable } from '@nestjs/common';

@Injectable()
export class AppContentService {
  getHello(): string {
    return 'Hello World!';
  }
}
