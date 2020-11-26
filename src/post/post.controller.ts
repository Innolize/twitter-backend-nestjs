import { Controller, Get } from '@nestjs/common';

@Controller('post')
export class PostController {
    @Get()
    test(): string {
        return 'Test post controller'
    }

}
