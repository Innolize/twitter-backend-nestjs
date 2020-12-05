import { BadRequestException, Body, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { editUserDTO } from './dto/editUser.dto';
import { createUserDTO } from './dto/createUser.dto';
import { UserInterface } from './interfaces/user.interface'

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private readonly userModel: Model<UserInterface>) { }

    createUser = async (user: createUserDTO): Promise<UserInterface> => {
        const userExist = await this.userModel.findOne({ 'email': user.email })
        if (userExist) {
            throw new BadRequestException('User already registered with that email!')
        }

        const newUser = new this.userModel(user)
        return await newUser.save()
    }

    getUsers = async (): Promise<UserInterface[]> => {
        return await this.userModel.find().select('-password')
    }

    editUser = async (id: string, dto: editUserDTO, user?: UserInterface): Promise<UserInterface> => {
        if (user && id !== user.id) {
            //Comparo el id del usuario a editar con el usuario logeado antes de buscarlo
            //en la base de datos, por eso esta la posibilidad de que no exista
            //el usuario.
            throw new ForbiddenException('User not found or unauthorized')
        }
        const userUpdated = await this.userModel.findByIdAndUpdate({ "_id": id }, dto, { new: true })


        return userUpdated
    }

    delete = async (id: string, user?:UserInterface) => {
        if (user && id !== user.id) {
            //Comparo el id del usuario a editar con el usuario logeado antes de buscarlo
            //en la base de datos, por eso esta la posibilidad de que no exista
            //el usuario.
            throw new ForbiddenException('User not found or unauthorized')
        }

        return await this.userModel.findOneAndDelete({ '_id': id })
    }

    getUser = async (id: string): Promise<UserInterface> => {
        const user = await this.userModel.findById(id).select('-password')
        return user
    }

    findFullUser = async (email: string): Promise<UserInterface> => {
        const user = await this.userModel.findOne({ email }).select('+password')
        return user
    }
}
