import { Controller, Get } from '@nestjs/common';
import { AppContentService } from './app-content.service';

@Controller()
export class AppContentController {
  constructor(private readonly appContentService: AppContentService) {}

  @Get()
  getHello(): string {
    return this.appContentService.getHello();
  }
}
