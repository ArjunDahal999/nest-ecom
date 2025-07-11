import { Request } from 'express';
import { RequestContext } from '../request-context.dto';
import {
  FORWARDED_FOR_TOKEN_HEADER,
  REQUEST_ID_TOKEN_HEADER,
} from 'src/shared/constants/common';
import { User } from '@prisma/client';
import { v4 } from 'uuid';

declare module 'express' {
  interface Request {
    user?: User | null;
  }
}

export function createRequestContext(request: Request): RequestContext {
  const ctx = new RequestContext();
  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER) ?? v4();
  ctx.url = request.url;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER)
    ? request.header(FORWARDED_FOR_TOKEN_HEADER)
    : request.ip;
  ctx.user = request.user ?? null;
  return ctx;
}
