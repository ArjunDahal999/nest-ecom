import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { ReqContext } from 'src/shared/request-context/request-context.decorator';
import { GenerateMagicLinkDto } from './dto/auth-generate-magic-link.dto';
import { LocalGuard } from './guards/local.guard';
import { RefreshTokenAuthGuard } from './guards/refresh-token.guard';
import { RefreshPayload } from './config/payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  login(
    @Request()
    req: Express.Request & {
      user: {
        email: string;
      };
    },
  ) {
    return this.authService.signIn({
      email: req.user.email,
    });
  }

  @Post('generate-magic-link')
  generateMagicLink(
    @ReqContext() ctx: RequestContext,
    @Body() body: GenerateMagicLinkDto,
  ) {
    return this.authService.generateLoginToken({
      ctx,
      email: body.email,
      role: body.role,
    });
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('generate-access-token')
  generateAccessToken(
    @ReqContext() ctx: RequestContext,
    @Request() req: Express.Request & { user: RefreshPayload },
  ) {
    return this.authService.generateAccessToken({
      ctx,
      userId: req.user.sub,
    });
  }
}
