import { User } from '@prisma/client';

export class RequestContext {
  public requestID: string | undefined;

  public url: string;

  public ip: string | undefined;

  public user: User | null;
}
