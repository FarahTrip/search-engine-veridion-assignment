import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapingService } from './scraping/scraping.service';

@Controller()
export class AppController {
  constructor(private readonly scrapService: ScrapingService) {}

  @Post('search')
  async search(@Query() params: { contact: string }) {
    return params;
  }

  @Get('scrap')
  async scrap() {
    return this.scrapService.scrapWebsites();
  }

  @Get('getStatistics')
  async getStatistics() {
    return this.scrapService.getStatistics();
  }
}
