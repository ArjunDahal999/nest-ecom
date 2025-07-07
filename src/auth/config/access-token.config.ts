import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as fs from 'fs';

export default registerAs(
  'jwt.config',
  (): JwtModuleOptions => ({
    publicKey: fs.readFileSync('./cert/access-token.public.key'),
    privateKey: fs.readFileSync('./cert/access-token.private.key'),
    signOptions: {
      algorithm: 'RS256',
    },
  }),
);
