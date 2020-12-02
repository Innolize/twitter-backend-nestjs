import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createUserDTO } from './dto/user.dto';
import { UserInterface } from './interfaces/user.interface'

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private readonly userModel: Model<UserInterface>) { }

    createUser = async (user: createUserDTO): Promise<UserInterface> => {
        const newUser = new this.userModel(user)
        return await newUser.save()
    }

    getUsers = async (): Promise<UserInterface[]> => {
        return await this.userModel.find().select('-password')
    }

    delete = async (id: string) => {
        return await this.userModel.findOneAndDelete({ '_id': id })
    }

    getUser = async (id: string): Promise<UserInterface> => {
        const user = await this.userModel.findById(id).select('-password')
        return user
    }

    findOne = async (email: string): Promise<UserInterface> => {        
        const user = await this.userModel.findOne({ email }).select('+password')
        console.log("user", user)
        return user
    }
}
