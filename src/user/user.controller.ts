import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, ServiceUnavailableException, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserInterface } from './interfaces/user.interface';
import { UserService } from './user.service';
import { User } from '../common/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { createUserDTO } from './dto/createUser.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { editUserDTO } from './dto/editUser.dto';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResourses } from 'src/app.roles';
import { Response, Express } from 'express';
import { UploadService } from 'src/upload/upload.service';
import { ExpressAdapter, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { EditUserFiles } from './dto/editUserFiles';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder,
        private readonly uploadService: UploadService
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

    @Auth({
        possession: "own",
        action: "update",
        resource: AppResourses.USER
    })
    @Put('/:id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'profile', maxCount: 1 },
        { name: 'cover', maxCount: 1 }]))
    async editUser(
        @UploadedFiles() files: EditUserFiles,
        @User() user: UserInterface,
        @Param('id') id: string,
        @Body() dto: editUserDTO,
    ) {
        const cover = files.cover?.[0]
        const profile = files.profile?.[0]

        if (profile) {
            try {
                const uploadedImageUrl = await this.uploadService.uploadProfileImage(profile)
                dto.profilePicture = uploadedImageUrl
            } catch (err) {
                throw new ServiceUnavailableException('error uploading image')
            }
        } else {
            //Previene intentos maliciosos en propiedades del dto
            delete dto.profilePicture
        }
        if (cover) {
            try {
                const uploadedImageUrl = await this.uploadService.uploadProfileImage(cover)
                dto.cover = uploadedImageUrl
            } catch (err) {
                profile ? await this.uploadService.removeImage(dto.profilePicture) : null
                throw new ServiceUnavailableException('error uploading image')
            }
        } else {
            //Previene intentos maliciosos en propiedades del dto
            delete dto.cover
        }

        // let result: any
        if (this.rolesBuilder.can(user.roles).updateAny(AppResourses.USER).granted) {
            //ADMIN
            try {
                let userBeforeEdit = await this.userService.editUser(id, dto)
                profile && userBeforeEdit.profilePicture ? await this.uploadService.removeImage(userBeforeEdit.profilePicture) : null
                cover && userBeforeEdit.cover ? await this.uploadService.removeImage(userBeforeEdit.cover) : null
            } catch (err) {
                profile ? await this.uploadService.removeImage(dto.profilePicture) : null
                cover ? await this.uploadService.removeImage(dto.cover) : null
                console.log(err)
            }
        } else {
            //AUTHOR
            try {
                let userBeforeEdit = await this.userService.editUser(id, dto, user)
                profile && userBeforeEdit.profilePicture ? await this.uploadService.removeImage(userBeforeEdit.profilePicture) : null
                cover && userBeforeEdit.cover ? await this.uploadService.removeImage(userBeforeEdit.cover) : null
            } catch (err) {
                profile ? await this.uploadService.removeImage(dto.profilePicture) : null
                cover ? await this.uploadService.removeImage(dto.cover) : null
                console.log(err)
            }
        }
        console.log("success")
        return
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
        action: "delete",
        resource: AppResourses.USER
    })
    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.delete(id)
    }

}
