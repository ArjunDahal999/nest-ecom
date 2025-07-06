import { MailerModule } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'email.config',
  (): MailerModule => ({
    registerAs: {
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" < ${process.env.MAIL_USER}>`,
      },
    },
  }),
);
