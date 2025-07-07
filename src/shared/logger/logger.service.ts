/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger, transports, format } from 'winston';

import { RequestContext } from '../request-context/request-context.dto'; // Adjust this path as per your project structure

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      level: 'info',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(
              ({ level, message, contextName, ctx, timestamp, ...meta }) => {
                let logOutput = `${timestamp} [${level}]`;
                if (contextName && typeof contextName === 'string') {
                  logOutput += ` [${contextName}]`;
                }
                // Safely check for requestId property
                if (
                  ctx &&
                  typeof ctx === 'object' &&
                  'requestId' in ctx &&
                  typeof (ctx as Record<string, unknown>).requestId ===
                    'string' &&
                  (ctx as Record<string, unknown>).requestId
                ) {
                  logOutput += ` [ReqId: ${(ctx as Record<string, string>).requestId}]`;
                }
                logOutput += ` ${message}`;
                if (Object.keys(meta).length > 0) {
                  try {
                    logOutput += ` ${JSON.stringify(meta)}`;
                  } catch (e: unknown) {
                    let errMsg = 'Unknown error';
                    if (
                      typeof e === 'object' &&
                      e &&
                      'message' in e &&
                      typeof (e as { message?: unknown }).message === 'string'
                    ) {
                      errMsg = (e as { message: string }).message;
                    }
                    logOutput += ` [Meta data could not be stringified: ${errMsg}]`;
                  }
                }
                return logOutput;
              },
            ),
          ),
        }),
      ],
    });
  }

  error(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  warn(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  debug(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  verbose(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.verbose({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  log(
    ctx: RequestContext | null,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    if (!ctx) {
      return this.logger.info({
        message,
        ...meta,
      });
    }
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
}
