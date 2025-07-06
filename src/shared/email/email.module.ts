// mail.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AppLoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    AppLoggerModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'dahalarjun404@gmail.com',
          pass: 'wndgzykputpipoxt',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@yourdomain.com>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // Make EmailService available for injection in other modules
})
export class EmailModule {}
