import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { render } from '@react-email/render';
import { EmailService } from 'src/shared/email/email.service';
import { AppLoggerService } from 'src/shared/logger/logger.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import MagicLinkEmail from '../emails/auth/magic-link';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private loggerService: AppLoggerService,
    private prismaService: PrismaService,
    private emailService: EmailService,
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
      let user = await this.userService.findOne(email);
      if (!user) {
        user = await this.userService.create(ctx, {
          email,
          role,
        });
      }
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
      const new_token = await prisma.session.create({
        data: {
          userId: user.id,
          login_token: uuidv4(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
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

  async signIn({ email }: { email: string }) {
    const user = await this.userService.findOne(email);
    if (!user) throw new UnauthorizedException('User not found');
    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'sdfsdf',
      expiresIn: '7d', // example, adjust as needed
    });
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    this.loggerService.log(null, `User ${email} signed in successfully`);
    return {
      accessToken,
      refreshToken,
    };
  }

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
          expiresAt: {
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
}
