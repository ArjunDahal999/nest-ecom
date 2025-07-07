import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailLocalStrategy } from './strategies/email.strategy';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import refreshTokenConfig from './config/refresh-token.config';
import accessTokenConfig from './config/access-token.config';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailLocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  imports: [
    UserModule,
    JwtModule.registerAsync(accessTokenConfig.asProvider()),
    ConfigModule.forFeature(accessTokenConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    SharedModule,
  ],
})
export class AuthModule {}
