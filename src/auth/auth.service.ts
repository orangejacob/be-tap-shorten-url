import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { saltRounds } from './constants';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { RegisterDto, SignInDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: SignInDto, response: Response) {
    const user = await this.usersService.getUser(dto.username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (!(await user.validatePassword(dto.password))) {
      throw new Error('Password is incorect');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.username,
    );

    this.setCookieTokens(accessToken, refreshToken, response);

    return {
      message: 'Logged in successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return;
  }

  async register(dto: RegisterDto, response: Response) {
    const [username, password] = [dto.username, dto.password];
    const userExist = await this.usersService.getUser(username);

    if (userExist !== null) {
      throw new ConflictException('Username already exists, please try again.');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await this.usersService.createUser(username, hashedPassword);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.username,
    );

    this.setCookieTokens(accessToken, refreshToken, response);

    return {
      message: 'Logged in successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY'),
        },
      ),
      this.jwtService.sign(
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRY'),
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async setCookieTokens(
    accessToken: string,
    refreshToken: string,
    res: Response,
  ) {
    // Set the JWT as a cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 900000, // 15 min
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 3600000 * 24 * 3, // 3 days in milliseconds
    });
  }
}
