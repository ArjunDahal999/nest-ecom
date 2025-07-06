import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
