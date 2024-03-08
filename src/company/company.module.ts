import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
