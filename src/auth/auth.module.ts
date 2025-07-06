import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailLocalStrategy } from './strategies/email.strategies';
import { SharedModule } from 'src/shared/shared.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailLocalStrategy],
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS || 'defaultSecret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ConfigModule.forFeature(jwtConfig),
    SharedModule,
  ],
})
export class AuthModule {}
