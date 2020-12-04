import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createPostDTO } from 'src/post/dto/post.dto';
import { editUserDTO } from './dto/editUser.dto';
import { createUserDTO } from './dto/user.dto';
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

    editUser = async (id: string, user: editUserDTO): Promise<UserInterface> => {
        return this.userModel.findByIdAndUpdate(id, user, { new: true })
    }

    delete = async (id: string) => {
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
