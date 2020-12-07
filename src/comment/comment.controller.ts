import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResourses } from 'src/app.roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { CommentService } from './comment.service';
import { createCommentDTO as CreateDTO } from './dto/createComment.dto'
import { editCommentDTO } from './dto/editComment.dto'

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        @InjectRolesBuilder()
        private readonly rolesbuilder: RolesBuilder
    ) { }

    @Get()
    async allComments() {
        const results = await this.commentService.allComments()
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
        return await this.commentService.createComment(dto.postId, dto.message, user)
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
    @Delete('/:id')
    async deleteComment
        (
            @Param('id') id: string,
            @User() user: UserInterface
        ) {

        if (this.rolesbuilder.can(user.roles).deleteAny(AppResourses.COMMENT).granted) {
            //ADMIN
            return await this.commentService.deleteComment(id)
        } else {
            return await this.commentService.deleteComment(id, user)
        }

    }
}
