import { Controller, Get, Param } from '@nestjs/common';

@Controller('post')
export class PostController {
    @Get()
    getAll(): string {
        return 'Test post controller'
    }

    @Get('/:id')
    getOne(@Param("id") id: Number): Number {
        return id
    }

}

