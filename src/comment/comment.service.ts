import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import validateObjectId from 'src/common/utils/objectIdValidator';
import { PostService } from 'src/post/post.service';
import { UserInterface as User, UserInterface } from 'src/user/interfaces/user.interface';
import { editCommentDTO } from './dto/editComment.dto';
import { CommentAuthor } from './interfaces/CommentAuthor';
import { CommentInterface } from './schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<CommentInterface | CommentAuthor>,
        private readonly postService: PostService
    ) { }

    allComments = async (postId: string) => {
        validateObjectId(postId, 'Invalid comment id')
        const response = await this.commentModel.find({ postId }).populate('author', 'profilePicture _id name surname').sort("asc")
        console.log(response)
        return response
    }

    getSingleComment = async (commentId: string) => {
        validateObjectId(commentId, 'Invalid comment id')
        console.log("linea 26", commentId)
        const comment = await this.commentModel.findById(commentId)
            .orFail(() => { throw new NotFoundException('Comment not found or unauthorized') })

        return comment
    }

    createComment = async (postId: string, message: string, user: UserInterface): Promise<CommentInterface> => {
        validateObjectId(postId, 'Invalid post id')

        try {
            const { id: author } = user
            await this.postService.findById(postId)
            const comment = { author, message, postId }
            const newComment = new this.commentModel(comment)
            let result = await newComment.save()
            result = await result.populate('author', 'profilePicture _id name surname').execPopulate()
            console.log(result)
            await this.postService.addCommentToPost(postId, result._id)
            return result
        } catch (err) {
            throw new NotFoundException(err.message)
        }
    }

    editComment = async (commentId: string, message: editCommentDTO, user?: UserInterface) => {
        validateObjectId(commentId, 'Invalid comment id')

        const comment = await this.getSingleComment(commentId)
        console.log(comment)
        if (user && comment.author.toString() !== user.id) {
            throw new NotFoundException('Comment not found or unauthorized')
        }
        return await this.commentModel.findByIdAndUpdate(commentId, message, { new: true })
    }

    deleteComment = async (commentId: string, user?: UserInterface) => {

        validateObjectId(commentId, 'Invalid comment id')

        const comment = await this.getSingleComment(commentId)
        if (user && comment.author.toString() !== user.id) {
            throw new NotFoundException('Comment not found or unauthorized')
        }
        await this.postService.removeCommentToPost(comment.postId, comment.id)
        const commentDeleted = await this.commentModel.findByIdAndDelete(comment.id)
        return commentDeleted
    }

    likeComment = async (commentId: string, userId: string): Promise<CommentAuthor> => {
        const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, { $push: { likesArr: userId }, $inc: { likesNumb: 1 } }, { new: true }).populate('author', 'profilePicture _id name surname') as CommentAuthor
        return updatedComment
    }

    dislikeComment = async (commentId: string, userId: string): Promise<CommentAuthor> => {
        const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, { $pull: { likesArr: userId }, $inc: { likesNumb: -1 } }, { new: true }).populate('author', 'profilePicture _id name surname') as CommentAuthor
        console.log(updatedComment)
        return updatedComment
    }

}
