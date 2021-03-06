import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AccessControlModule } from 'nest-access-control';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { roles } from './app.roles';
import { CommentModule } from './comment/comment.module';

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
    AccessControlModule.forRoles(roles),
    PostModule,
    UserModule,
    AuthModule,
    CommentModule],
})
export class AppModule { }
