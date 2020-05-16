import { Controller, Get, Query } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Get()
  async getProducts(@Query('url') url: string) {
    return this.requestsService.proxy(url);
  }
}
