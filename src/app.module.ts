import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './scraping/scraping.module';
import { ScrapingService } from './scraping/scraping.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ScrapingModule, ScrapingModule, ScheduleModule.forRoot(), PrismaModule],
  controllers: [AppController],
  providers: [AppService, ScrapingService, PrismaService],
})
export class AppModule {}
