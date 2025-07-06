import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReqContext } from 'src/shared/request-context/request-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

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

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
