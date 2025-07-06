import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AuthEmailDto } from '../dto/auth-email.dto';

@Injectable()
export class EmailLocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(req: Request): Promise<any> {
    const { email, token } = req.body as AuthEmailDto;
    if (!email || !token) {
      throw new UnauthorizedException(
        'Email is required and must be a string.',
      );
    }
    const user = await this.authService.validateUser({ email, token });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
