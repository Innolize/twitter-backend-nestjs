import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { loginDTO } from './dto/login.dto';
import { UserInterface } from './interfaces/user.interface';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() user): Promise<UserInterface> {
        return this.userService.createUser(user)
    }

    @Get()
    async getUsers(): Promise<UserInterface[]> {
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

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.delete(id)
    }

    @Post('/test')
    async test(@Body() user: loginDTO) {
        const foundUser = await this.userService.logIn(user.email)
        const result = bcrypt.compare(user.password, foundUser.password, function (err, result) {
            if (err) {
                console.log('error: ', err)
            } else {
                console.log('exito: ', result)
            }
        })
        return result
    }

}
