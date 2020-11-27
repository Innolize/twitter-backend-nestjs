import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDTO, updatePostDTO } from './dto/post.dto'
import { Post as PostInterface } from './interfaces/post.interfaces';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) { }

    @Get()
    async getAll() {
        return await this.postService.getAll()
    }

    @Get('/:id')
    async getOne(@Param("id") id: string): Promise<PostInterface> {
        return await this.postService.findById(id)
    }

    @Post('/createPost')
    async createPost(@Body() body: createPostDTO): Promise<PostInterface> {
        return await this.postService.create(body)
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() post: updatePostDTO): Promise<PostInterface> {
        return this.postService.updatePost(id, post)
    }

    @Delete('/:id')
    async deletePost(@Param('id') id: string) {
        return this.postService.deletePost(id)
    }
}

