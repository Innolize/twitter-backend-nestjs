import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { swaggerInit } from "./app.swagger";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<ConfigService>("ConfigService");
  app.enableCors({
    origin: configService.get<string>("ORIGIN_URL"),
    credentials: true,
  });
  swaggerInit(app);

  await app.listen(configService.get<string>("PORT") || 4000);
}
bootstrap();
