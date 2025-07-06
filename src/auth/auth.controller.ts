import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { ReqContext } from 'src/shared/request-context/request-context.decorator';
import { GenerateMagicLinkDto } from './dto/auth-generate-magic-link.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request()
    req: Express.Request & {
      user: {
        email: string;
      };
    },
  ) {
    return await this.authService.signIn({
      email: req.user.email,
    });
  }

  @Post('generate-magic-link')
  async generateMagicLink(
    @ReqContext() ctx: RequestContext,
    @Body() body: GenerateMagicLinkDto,
  ) {
    return this.authService.generateLoginToken({
      ctx,
      email: body.email,
      role: body.role,
    });
  }
}
