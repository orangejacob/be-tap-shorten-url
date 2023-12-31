import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('APP_PORT', 3000);
  app.enableCors({ credentials: true, origin: ['http://localhost:3000'] });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, '0.0.0.0');
}
bootstrap();
