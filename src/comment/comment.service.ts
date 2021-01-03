import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import validateObjectId from 'src/common/utils/objectIdValidator';
import { Post } from 'src/post/interfaces/post.interface';
import { UserInterface as User, UserInterface } from 'src/user/interfaces/user.interface';
import { editCommentDTO } from './dto/editComment.dto';
import { CommentInterface } from './schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<CommentInterface>,
        @InjectModel('Post')
        private readonly postModel: Model<Post>
    ) { }

    allComments = async (postId: string) => {
        const response = await this.commentModel.find({ postId }).populate('post').sort("asc")
        console.log(response)
        return response
    }

    getSingleComment = async (commentId: string) => {
        validateObjectId(commentId, 'invalid comment id')

        const comment = await this.commentModel.findById(commentId)
            .orFail(() => { throw new NotFoundException('Comment not found or unauthorized') })

        return comment
    }

    createComment = async (postId: string, message: string, user: UserInterface) => {
        validateObjectId(postId, 'Invalid post id')

        try {
            const post = await this.postModel.findById(postId)
                .orFail(() => { throw new NotFoundException('Post not found or unauthorized') })
            const comment = { authorId: user.id, message, postId }
            const newComment = new this.commentModel(comment)
            return await newComment.save()
        } catch (err) {
            throw new NotFoundException(err.message)
        }
    }

    editComment = async (commentId: string, message: editCommentDTO, user?: UserInterface) => {
        validateObjectId(commentId, 'Invalid comment id')

        const comment = await this.getSingleComment(commentId)
        console.log(comment)
        if (user && comment.authorId.toString() !== user.id) {
            throw new NotFoundException('Comment not found or unauthorized')
        }
        return await this.commentModel.findByIdAndUpdate(commentId, message, { new: true })
    }

    deleteComment = async (commentId: string, user?: UserInterface) => {
        validateObjectId(commentId, 'Invalid comment id')

        const comment = await this.getSingleComment(commentId)
        if (user && comment.authorId.toString() !== user.id) {
            throw new NotFoundException('Comment not found or unauthorized')
        }
        return await this.commentModel.findByIdAndDelete(commentId)
    }

}
