import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AccessControlModule } from 'nest-access-control';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { roles } from './app.roles';
import { CommentModule } from './comment/comment.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE'),
        useFindAndModify: false
      }),
      inject: [ConfigService]
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        storage: memoryStorage
      }),
      inject: [ConfigService]
    }),
    AccessControlModule.forRoles(roles),
    PostModule,
    UserModule,
    AuthModule,
    CommentModule,
    UploadModule]
})
export class AppModule { }
