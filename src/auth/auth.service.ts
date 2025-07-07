import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CREDENTIAL_PROVIDER, Role } from '@prisma/client';
import { render } from '@react-email/render';
import { EmailService } from 'src/shared/email/email.service';
import { AppLoggerService } from 'src/shared/logger/logger.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigType } from '@nestjs/config';
import MagicLinkEmail from '../emails/auth/magic-link';
import refreshTokenConfig from './config/refresh-token.config';
import { AccessPayload } from './config/payload';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private loggerService: AppLoggerService,
    private prismaService: PrismaService,
    private emailService: EmailService,
    @Inject(refreshTokenConfig.KEY)
    private refreshJwtService: ConfigType<typeof refreshTokenConfig>,
  ) {}
  // #region  Generate Login Token
  async generateLoginToken({
    ctx,
    email,
    role,
  }: {
    ctx: RequestContext;
    email: string;
    role: Role;
  }) {
    this.loggerService.log(ctx, `Generating login token for ${email}`);
    await this.prismaService.$transaction(async (prisma) => {
      let user = await this.userService.findOneWithEmail(email);
      console.log('user', user);
      if (!user) {
        user = await this.userService.create(ctx, {
          email,
          role,
          credentialProvider: CREDENTIAL_PROVIDER.EMAIL,
        });
      }
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
      console.log('Creating new session for user', user.id);
      const new_token = await prisma.session.create({
        data: {
          userId: user.id,
          login_token: uuidv4(),
          login_token_expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      const emailHtml: string = await render(
        MagicLinkEmail({ token: new_token.login_token, email: user.email }),
      );
      await this.emailService.sendEmail({
        to: email,
        subject: 'Login Token',
        html: emailHtml,
        ctx,
      });
    });
    return {
      message: 'Login token sent to your email',
    };
  }
  // #endregion

  // #region Sign In
  async signIn({ email }: { email: string }) {
    const user = await this.userService.findOneWithEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const subject = { sub: user.id };
    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(subject, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
    });
    const refreshToken = this.jwtService.sign(
      { ...payload, ...subject },
      this.refreshJwtService,
    );

    this.loggerService.log(null, `User ${email} signed in successfully`);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  // #endregion

  // #region Validate User
  async validateUser({ email, token }: { email: string; token: string }) {
    return await this.prismaService.$transaction(async (prisma) => {
      this.loggerService.log(
        null,
        `Validating user with email: ${email} and token: ${token}`,
      );
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const session = await prisma.session.findFirst({
        where: {
          user: {
            email,
          },
          login_token: token,
          login_token_expiresAt: {
            gte: new Date(),
          },
        },
      });
      if (!session) {
        throw new UnauthorizedException(
          'Invalid or expired token pls Login again',
        );
      }
      return user;
    });
  }
  // #endregion

  // #region Generate Refresh Token
  async generateAccessToken({
    ctx,
    userId,
  }: {
    ctx: RequestContext;
    userId: string;
  }) {
    this.loggerService.log(ctx, `Generating access token for user ${userId}`);
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const payload: AccessPayload = {
      sub: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
  // #endregion
}
