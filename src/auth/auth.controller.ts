import { Body, Controller, Post, Req } from '@nestjs/common';

import { RegisterDto, SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Post('register')
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req?.user?.username);
  }
}
