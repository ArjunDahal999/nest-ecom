import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';
import * as fs from 'fs';

import { ExtractJwt } from 'passport-jwt';
import { RefreshPayload } from '../config/payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fs.readFileSync('./cert/access-token.public.key', 'utf-8'),
      algorithms: ['RS256'],
    };
    super(options);
  }

  validate(payload: RefreshPayload) {
    console.log('JWT Strategy payload:', payload);
    return { ...payload };
  }
}
