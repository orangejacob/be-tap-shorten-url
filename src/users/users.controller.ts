import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('self')
  fetchProfile(@Request() req) {
    return this.userService.getUser(req?.user?.username);
  }
}
