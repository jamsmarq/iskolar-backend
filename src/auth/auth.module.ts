import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strats/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  // exports: [AuthService]
})
export class AuthModule {}
