import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from 'src/post/post.module';
import { PostService } from 'src/post/post.service';
import { PostSchema } from 'src/post/schemas/post.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentSchema } from './schemas/comment.schema'

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Comment', schema: CommentSchema }]),
    PostModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule { }
