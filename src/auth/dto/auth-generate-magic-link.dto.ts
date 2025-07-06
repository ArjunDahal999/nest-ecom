import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GenerateMagicLinkDto {
  @ApiProperty({
    default: 'dahalarjun404@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    enum: [Role.CUSTOMER, Role.SELLER],
    description: 'User role',
  })
  @IsNotEmpty()
  @IsEnum([Role.CUSTOMER, Role.SELLER])
  role: Role;
}
