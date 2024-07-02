import { Controller, Get } from '@nestjs/common';
import { AppGateService } from './app-gate.service';

@Controller()
export class AppGateController {
  constructor(private readonly appGateService: AppGateService) {}

  @Get()
  getHello(): string {
    return this.appGateService.getHello();
  }
}
