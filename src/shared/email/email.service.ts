// mail.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../logger/logger.service';
import { RequestContext } from '../request-context/request-context.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private logger: AppLoggerService,
  ) {}
  async sendEmail({
    ctx,
    to,
    subject,
    html,
  }: {
    ctx: RequestContext;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      this.logger.log(ctx, `Email sent to ${to} with subject "${subject}"`);
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      let errorStack: string | undefined = undefined;
      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      }
      this.logger.error(ctx, `Failed to send email to ${to}`, {
        error: errorMessage,
        stack: errorStack,
      });
      throw error;
    }
  }
}
