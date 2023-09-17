import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return next();
    } catch (err) {
      if (err?.name !== 'TokenExpiredError') {
        return next();
      }

      // Extract expired payload data
      const expiredData: any = this.jwtService.decode(token);
      const refreshToken = await this.authService.getRefreshToken(
        expiredData?.username,
      );

      if (!refreshToken) {
        return next();
      }

      try {
        const userData = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        // Generate a new access token.
        const { accessToken } = await this.authService.generateTokens(
          userData?.sub,
          userData?.username,
        );

        // Attach the new token to the request.
        req.headers['authorization'] = `Bearer ${accessToken}`;
        return next();
      } catch (error) {
        // If there's an error during refresh (e.g., refresh token is also expired), proceed without modification.
        return next();
      }
    }
  }
}
