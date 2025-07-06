import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'dahalarjun404@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ enum: Role, description: 'User role', default: Role.CUSTOMER })
  @IsNotEmpty()
  @IsEnum(Role, {
    message: `role must be a valid enum value: ${Object.values(Role).join(', ')}`,
  })
  role: Role;
}
