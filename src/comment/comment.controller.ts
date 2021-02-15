import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppGateway } from 'src/app.gateway';
import { AppResourses } from 'src/app.roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { PostService } from 'src/post/post.service';
import { SocketService } from 'src/socket/socket.service';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { CommentService } from './comment.service';
import { findByPostDTO } from './dto/commentPost.dto';
import { createCommentDTO as CreateDTO } from './dto/createComment.dto'
import { editCommentDTO } from './dto/editComment.dto'
import { CommentInterface } from './schemas/comment.schema';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly postService: PostService,
        @InjectRolesBuilder()
        private readonly rolesbuilder: RolesBuilder,
        private readonly socketService: SocketService
    ) { }

    @Get('/post/:id')
    async commentsByPost(@Param('id') postId: string) {
        const results = await this.commentService.allComments(postId)
        return results
    }

    @Get('/:id')
    async getComment(@Param('id') id: string) {
        return await this.commentService.getSingleComment(id)
    }

    @Auth({
        possession: 'own',
        action: 'create',
        resource: AppResourses.COMMENT
    })
    @Post('/create')
    async createComment
        (
            @Body() dto: CreateDTO,
            @User() user: UserInterface
        ) {
        console.log(user)
        let response: CommentInterface
        try {
            response = await this.commentService.createComment(dto.postId, dto.message, user)
            this.socketService.newComment(dto.postId, response)
        } catch (err) {
            console.log(err)
        }
        return response
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResourses.COMMENT
    })
    @Put('/:id')
    async editComment
        (
            @Param('id') id: string,
            @Body() message: editCommentDTO,
            @User() user: UserInterface
        ) {
        if (this.rolesbuilder.can(user.roles).updateAny(AppResourses.COMMENT).granted) {
            //ADMIN
            return await this.commentService.editComment(id, message)
        } else {
            return await this.commentService.editComment(id, message, user)
        }
    }

    @Auth({
        possession: "own",
        action: 'delete',
        resource: AppResourses.COMMENT
    })
    @Delete('/delete/:id')
    async deleteComment
        (
            @Param('id') id: string,
            @User() user: UserInterface
        ) {

        if (this.rolesbuilder.can(user.roles).deleteAny(AppResourses.COMMENT).granted) {
            //ADMIN
            const commentDeleted = await this.commentService.deleteComment(id)
            this.socketService.removeCommentArray(commentDeleted.postId, commentDeleted)
            return commentDeleted
        } else {
            const commentDeleted = await this.commentService.deleteComment(id, user)
            this.socketService.removeCommentArray(commentDeleted.postId, commentDeleted)
            return commentDeleted
        }

    }

    @Auth()
    @Post('/like/:commentId')
    async likePost(
        @Param('commentId') commentId: string,
        @User() user: UserInterface
    ) {

        const userId = user._id
        const response = await this.commentService.getSingleComment(commentId)

        if (response.likesArr.includes(userId)) {
            const updatedComment = await this.commentService.dislikeComment(commentId, userId)
            console.log(updatedComment)
            this.socketService.updateCommentArray(updatedComment.postId, updatedComment)
            return updatedComment
        } else {
            const updatedComment = await this.commentService.likeComment(commentId, userId)
            this.socketService.updateCommentArray(updatedComment.postId, updatedComment)
            console.log(updatedComment)
            return updatedComment
        }
    }
}
