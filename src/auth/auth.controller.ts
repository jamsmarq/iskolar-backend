import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Body() signInDto: {username: string, password: string}) {
    return this.authService.validateUser(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  // @UseGuards(LocalAuthGuard)
  @Post('signup')
  signUp(@Body() signUpDto: {username: string, email: string, password: string}) {
    return this.authService.createUser(signUpDto.username, signUpDto.email, signUpDto.password);
  }
  
  // Add a verifyEmail endpoint

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
