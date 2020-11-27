import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from './interfaces/post.interfaces'
import { createPostDTO, updatePostDTO } from './dto/post.dto'

@Injectable()
export class PostService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) { }

    getAll = async (): Promise<Post[]> => {
        const data = await this.postModel.find()
        return data
    }

    create = async (post: createPostDTO): Promise<Post> => {
        const newPost = new this.postModel(post)
        return await newPost.save()
    }

    updatePost = async (id: string, post: updatePostDTO): Promise<Post> => {
        const updatedPost = await this.postModel.findByIdAndUpdate(id, post, { new: true })
        return updatedPost
    }

    findById = async (id: string): Promise<Post> => {
        return await this.postModel.findById(id)
    }

    deletePost = async (id: string) => {
        return await this.postModel.deleteOne({ '_id': id })
    }
}
