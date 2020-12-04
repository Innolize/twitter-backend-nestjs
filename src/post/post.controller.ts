import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDTO, updatePostDTO } from './dto/post.dto'
import { Post as PostInterface } from './interfaces/post.interface';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AppResourses, AppRole } from 'src/app.roles';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

@ApiTags('Posts')
@Controller('post')
export class PostController {
    constructor(
        private postService: PostService,
        @InjectRolesBuilder()
        private rolesBuilder: RolesBuilder
    ) { }

    @Get()
    async getAll() {
        return await this.postService.getAll()
    }

    @Get('/:id')
    async getOne(@Param("id") id: string): Promise<PostInterface> {
        return await this.postService.findById(id)
    }

    @Auth({
        possession: "own",
        action: "create",
        resource: AppResourses.POST
    })
    @Post('/createPost')
    async createPost(@Body() dto: createPostDTO, @User() user: UserInterface): Promise<PostInterface> {
        return await this.postService.create(dto, user)
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResourses.POST
    })
    @Put('/:id')
    async updatePost(
        @Param('id') id: string,
        @Body() post: updatePostDTO,
        @User() user: UserInterface
    ): Promise<PostInterface> {
        let result: any
        if (this.rolesBuilder.can(user.roles).updateAny(AppResourses.POST).granted) {
            //ADMIN
            result = this.postService.updatePost(id, post)
        } else {
            //AUTHOR
            result = this.postService.updatePost(id, post, user)
        }
        return result
    }

    @Auth({
        possession: "own",
        action: "delete",
        resource: AppResourses.POST
    })
    @Delete('/:id')
    async deletePost(
        @Param('id') id: string,
        @User() user: UserInterface
    ) {
        let result: any
        if (this.rolesBuilder.can(user.roles).deleteAny(AppResourses.POST).granted) {
            //ADMIN
            result = this.postService.deletePost(id)
        } else {
            //AUTHOR
            result = this.postService.deletePost(id, user)
        }
        return result
    }
}
