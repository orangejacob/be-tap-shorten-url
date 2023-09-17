import { Res, Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express';

import { RegisterDto, SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto,
  ) {
    return this.authService.login(signInDto, res);
  }

  @Post('register')
  signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto, res);
  }
}
