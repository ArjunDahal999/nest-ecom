/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new HttpException('JWT token has expired.', 403);
      }
      throw new UnauthorizedException({
        message: 'Invalid or missing JWT token.',
        errorCode: 'TOKEN_INVALID',
      });
    }
    return user;
  }
}
