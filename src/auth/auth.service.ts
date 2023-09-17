import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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

  async login(dto: SignInDto) {
    const user = await this.usersService.getUser(dto.username);
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    if (!(await user.validatePassword(dto.password))) {
      throw new BadRequestException('Password is incorect');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.username,
    );

    await this.usersService.updateRefreshToken(user.username, refreshToken);

    return {
      username: user.username,
      access_token: accessToken,
    };
  }

  async logout(username: string) {
    await this.usersService.updateRefreshToken(username, null);
    return;
  }

  async register(dto: RegisterDto) {
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

    await this.usersService.updateRefreshToken(username, refreshToken);

    return {
      username: user.username,
      access_token: accessToken,
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

  async getRefreshToken(username: string): Promise<string | null> {
    const user = await this.usersService.getUser(username);
    if (user?.refreshToken) {
      return user.refreshToken;
    }
    return null;
  }
}
