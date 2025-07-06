import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SharedModule],
  exports: [UserService],
})
export class UserModule {}
