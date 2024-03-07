import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ScrapingController],
  providers: [ScrapingService, PrismaService],
})
export class ScrapingModule {}
