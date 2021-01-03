import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';
import { UserService } from './user.service';
import { User } from '../common/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from './dto/createUser.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { editUserDTO } from './dto/editUser.dto';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResourses } from 'src/app.roles';
import { Response } from 'express';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
    ) { }

    @Post()
    async createUser(@Body() user: createUserDTO, @Res({ passthrough: true }) res: Response): Promise<UserInterface> {
        let respuesta: any
        try {
            respuesta = await this.userService.createUser(user)
            res.cookie('access_token', '12345', { httpOnly: true })
            return respuesta
        } catch (e) {
            console.log(e)
        }
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

    @Auth({
        possession: "own",
        action: "update",
        resource: AppResourses.USER
    })
    @Put('/:id')
    async editUser(
        @Param('id') id: string,
        @Body() dto: editUserDTO,
        @User() user: UserInterface
    ) {
        let result: any
        if (this.rolesBuilder.can(user.roles).updateAny(AppResourses.USER).granted) {
            //ADMIN
            result = await this.userService.editUser(id, dto)
        } else {
            //AUTHOR
            result = await this.userService.editUser(id, dto, user)
        }


        return result
    }

    @Auth({
        possession: "own",
        action: "delete",
        resource: AppResourses.USER
    })
    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.delete(id)
    }

}
