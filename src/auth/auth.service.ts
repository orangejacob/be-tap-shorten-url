import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { saltRounds } from './constants';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string, response: Response) {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (!(await user.validatePassword(password))) {
      throw new Error('Invalid username or password');
    }

    const payload = { username: user.username, sub: user.id };
    const jwt = this.jwtService.sign(payload);

    // Set the JWT as a cookie
    response.cookie('access_token', jwt, {
      httpOnly: true,
      maxAge: 600000, // 10 minutes in milliseconds
    });

    return { message: 'Logged in successfully' };
  }

  async register(username: string, plaintextPassword: string) {
    const usernameExist = await this.usersService.checkUserNameExists(username);

    if (usernameExist !== null) {
      throw new ConflictException('Username already exists, please try again.');
    }

    const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
    this.usersService.createUser(username, hashedPassword);
    return { message: 'User registered successfully' };
  }
}
