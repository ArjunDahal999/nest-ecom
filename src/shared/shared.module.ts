import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { AppLoggerModule } from './logger/logger.module';
import { EmailModule } from './email/email.module';

@Module({
  exports: [PrismaService, AppLoggerModule, EmailModule], // since we are using shared module in other modules, we need to export the modules and services
  imports: [AppLoggerModule, EmailModule],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
