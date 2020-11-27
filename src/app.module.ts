import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    MongooseModule.forRoot('mongodb://localhost/twitter-database', { useFindAndModify: false }),
    PostModule],
})
export class AppModule { }
