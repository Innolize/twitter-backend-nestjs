import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface as User } from 'src/user/interfaces/user.interface';
import { createCommentDTO } from './dto/createComment.dto';
import { CommentInterface } from './schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<CommentInterface>
    ) { }

    allComments = async () => {
        return await this.commentModel.find()
    }
    // user: User,
    createComment = async ( dto: createCommentDTO) => {
        // const comment = {author: user, }
        const newComment = new this.commentModel(dto)
        return await newComment.save()

    }

}
