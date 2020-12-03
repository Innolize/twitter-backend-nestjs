import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';


@Module({

  imports: [
    MongooseModule.forRoot('mongodb://localhost/twitter-database', { useFindAndModify: false }),
    PostModule,
    UserModule,
    AuthModule],
})
export class AppModule { }
