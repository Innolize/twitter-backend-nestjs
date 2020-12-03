import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';
import { UserService } from './user.service';
import { User as UserDecorator } from '../common/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from './dto/user.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() user: createUserDTO): Promise<UserInterface> {
        return this.userService.createUser(user)
    }


    @Get()
    async getUsers(@UserDecorator() user): Promise<UserInterface[]> {
        console.log(user)
        return await this.userService.getUsers()
    }

    @Get('/:id')
    async getUser(@Param('id') id: string): Promise<UserInterface> {
        const selectedUser = await this.userService.getUser(id)
        if (!selectedUser) {
            throw new NotFoundException()
        }
        return selectedUser
    }

    @Auth()
    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.delete(id)
    }

}
