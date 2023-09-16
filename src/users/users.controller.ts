import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getHello(): string {
    return '';
  }
}
