import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { AppLoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private logger: AppLoggerService, // by exporting it from shared model we are able to use it here
  ) {}

  async create(ctx: RequestContext, createUserDto: CreateUserDto) {
    this.logger.log(ctx, `${this.create.name} was called`);
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new HttpException('user already exists', HttpStatus.CONFLICT);
    }
    const user = await this.prismaService.user.create({
      data: {
        Role: createUserDto.role,
        email: createUserDto.email,
        provider: createUserDto.credentialProvider,
      },
    });

    this.logger.log(ctx, `User created with email: ${user.email}`);
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneWithEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findOneById(id: string) {
    console.log(`Finding user with ID: ${id}`);
    return await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
