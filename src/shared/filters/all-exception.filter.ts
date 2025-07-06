import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { REQUEST_ID_TOKEN_HEADER } from '../constants/common';
import { createRequestContext } from '../request-context/utils';
import { BaseApiException } from './base-http-exception';
import { AppLoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** set logger context */
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();

    const path = req.url;
    const timestamp = new Date().toISOString();
    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    const requestContext = createRequestContext(req);

    let stack: any;
    let statusCode: HttpStatus | undefined = undefined;
    let errorName: string | undefined = undefined;
    let message: string | undefined = undefined;
    let details: string | Record<string, any> | undefined = undefined;
    // TODO : Based on language value in header, return a localized message.
    const acceptedLanguage = 'ja';
    let localizedMessage: string | undefined = undefined;

    // TODO : Refactor the below cases into a switch case and tidy up error response creation
    if (exception instanceof BaseApiException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      localizedMessage = exception.localizedMessage
        ? exception.localizedMessage[acceptedLanguage]
        : undefined;
      details = exception.details || exception.getResponse();
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorName = exception.constructor.name;
      message = exception.message;
      details = exception.getResponse();
    } else if (exception instanceof Error) {
      errorName = exception.constructor.name;
      message = exception.message;
      stack = exception.stack;
    }

    // Set to internal server error in case it did not match above categories.
    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    errorName = errorName || 'InternalException';
    message = message || 'Internal server error';

    // NOTE: For reference, please check https://cloud.google.com/apis/design/errors
    const error = {
      statusCode,
      message,
      localizedMessage,
      errorName,
      details,
      // Additional meta added by us.
      path,
      requestId,
      timestamp,
    };
    this.logger.warn(requestContext, error.message, {
      error,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack,
    });

    res.status(statusCode).json({ error });
  }
}
