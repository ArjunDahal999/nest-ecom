import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as fs from 'fs';
import { RefreshPayload } from '../config/payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fs.readFileSync('./cert/refresh-token.public.key', 'utf-8'),
      algorithms: ['RS256'],
    };
    super(options);
  }

  validate(payload: RefreshPayload) {
    return { ...payload };
  }
}
