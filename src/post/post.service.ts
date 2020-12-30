import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from './interfaces/post.interface'
import { createPostDTO, updatePostDTO } from './dto/post.dto'
import { UserInterface } from 'src/user/interfaces/user.interface';
import validateObjectId from 'src/common/utils/objectIdValidator';

@Injectable()
export class PostService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) { }

    getAll = async (): Promise<Post[]> => {
        const data = await this.postModel.find().populate('author', )
        return data
    }

    create = async (post: createPostDTO, user: UserInterface): Promise<Post> => {
        const newPost = new this.postModel({ ...post, author: user.id })
        return await newPost.save()
    }

    updatePost = async (id: string, post: updatePostDTO, user?: UserInterface): Promise<Post> => {
        validateObjectId(id, 'Invalid post id')
        const data = await this.findById(id)
        const postFound = !user ? data : !!data && (data.author).toString() === user.id ? data : null
        if (!postFound) {
            throw new ForbiddenException('Post not found or unauthorized')
        }

        return await this.postModel.findByIdAndUpdate(id, post, { new: true })
    }

    findById = async (id: string) => {
        validateObjectId(id, 'Invalid post id')
        const respuesta = await this.postModel.findById(id).populate('author', 'profilePicture _id')
            .orFail(() => new NotFoundException('Post not found'))
        return respuesta
    }

    deletePost = async (id: string, user?: UserInterface) => {
        validateObjectId(id, 'Invalid post id')
        const post = await this.postModel.findById(id)
        if (!post || !(user && (post.author).toString() === user.id)) {
            throw new ForbiddenException('Post not found or unauthorized')
        }
        return await this.postModel.deleteOne({ '_id': id })
    }
}
