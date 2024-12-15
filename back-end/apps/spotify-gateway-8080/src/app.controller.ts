import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGuard } from '@app/shared/guards/app.guard';

@UseGuards(AppGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('guard-hellow')
  getHello(): string {
    return this.appService.getHello();
  }
}
