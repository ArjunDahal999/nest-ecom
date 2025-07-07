import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request as Rq,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReqContext } from 'src/shared/request-context/request-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { AccessTokenAuthGuard } from 'src/auth/guards/access-token.guard';
import { AccessPayload } from 'src/auth/config/payload';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(
    @ReqContext() ctx: RequestContext,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(ctx, createUserDto);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('me')
  findMe(@Rq() req: Request & { user: AccessPayload }) {
    return this.userService.findOneById((req.user as AccessPayload).sub);
  }
}
