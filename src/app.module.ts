import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './scraping/scraping.module';
import { ScrapingService } from './scraping/scraping.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScrapingModule, ScrapingModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ScrapingService],
})
export class AppModule {}
