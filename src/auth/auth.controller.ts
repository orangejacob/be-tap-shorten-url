import {
  Res,
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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
    return this.authService.login(signInDto.username, signInDto.password, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
    );
  }
}
