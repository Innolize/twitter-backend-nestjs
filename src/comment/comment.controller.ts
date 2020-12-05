import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @Get()
    async allComments() {
        const results = await this.commentService.allComments()
        console.log(results)
    }

    @Post('/create')
    async createComment(@Body() body) {
        return await this.commentService.createComment(body)
    }
}
