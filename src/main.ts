import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInit } from './app.swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  swaggerInit(app)
  app.enableCors({ credentials: true, origin: "http://localhost:3000" });

  const configService = app.get<ConfigService>('ConfigService')
  await app.listen(configService.get<string>('PORT') || 8000);
}
bootstrap();
