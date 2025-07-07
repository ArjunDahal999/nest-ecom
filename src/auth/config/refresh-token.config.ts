import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import * as fs from 'fs';

export default registerAs(
  'refresh.config',
  (): JwtSignOptions => ({
    privateKey: fs.readFileSync('./cert/refresh-token.private.key'),
    algorithm: 'RS256',
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
  }),
);
