import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from './interfaces/post.interface'
import { createPostDTO, updatePostDTO } from './dto/post.dto'
import { UserInterface } from 'src/user/interfaces/user.interface';

@Injectable()
export class PostService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) { }

    getAll = async (): Promise<Post[]> => {
        const data = await this.postModel.find().populate('author', 'profilePicture _id')
        return data
    }

    create = async (post: createPostDTO, user: UserInterface): Promise<Post> => {
        const newPost = new this.postModel({ ...post, authorId: user.id })
        return await newPost.save()
    }

    updatePost = async (id: string, post: updatePostDTO, user?: UserInterface): Promise<Post> => {
        const data = await this.findById(id)
        const postFound = !user ? data : !!data && (data.authorId).toString() === user.id ? data : null
        if (!postFound) {
            throw new ForbiddenException('Post not found or unauthorized')
        }

        return await this.postModel.findByIdAndUpdate(id, post, { new: true })
    }

    findById = async (id: string) => {
        const respuesta = await this.postModel.findById(id).populate('author', 'profilePicture _id')
        return respuesta
    }

    deletePost = async (id: string, user?: UserInterface) => {
        const post = await this.postModel.findById(id)
        const postFound = !user ? post : !!post && (post.authorId).toString() === user.id ? post : null

        if (!postFound) {
            throw new ForbiddenException('Post not found or unauthorized')
        }
        return await this.postModel.deleteOne({ '_id': id })
    }
}
