import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInit } from './app.swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({ credentials: true, origin: "http://localhost:3000" });
  swaggerInit(app)

  const configService = app.get<ConfigService>('ConfigService')
  await app.listen(configService.get<string>('PORT') || 8000);
}
bootstrap();
