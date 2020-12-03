import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AccessControlModule } from 'nest-access-control';

import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { roles } from './app.roles';


@Module({

  imports: [
    MongooseModule.forRoot('mongodb://localhost/twitter-database', { useFindAndModify: false }),
    AccessControlModule.forRoles(roles),
    PostModule,
    UserModule,
    AuthModule],
})
export class AppModule { }
