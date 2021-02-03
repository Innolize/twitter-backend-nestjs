import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { Post } from './interfaces/post.interface'
import { createPostDTO, updatePostDTO } from './dto/post.dto'
import { UserInterface } from 'src/user/interfaces/user.interface';
import validateObjectId from 'src/common/utils/objectIdValidator';

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<Post>,

    ) { }

    getAll = async (): Promise<Post[]> => {
        const data = await this.postModel.find().populate('author').sort({ createdAt: 'desc' })
        return data
    }

    create = async (post: createPostDTO, user: UserInterface): Promise<Post> => {
        const newPost = new this.postModel({ ...post, author: user.id })
        let savedPost = await newPost.save()
        savedPost = await savedPost.populate('author').execPopulate()
        return savedPost
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
        const respuesta = await this.postModel.findById(id).populate(
            {
                path: "commentsArr",
                populate: {
                    path: "author",
                    select: "profilePicture _id name surname"
                }
            }
        )
            .populate('author', 'profilePicture _id name surname')

            .orFail(() => new NotFoundException('Post not found'))
        return respuesta
    }

    findByAuthorId = async (authorId: string) => {
        const respuesta = await this.postModel.find({ author: authorId })
            .populate('author', 'profilePicture _id name surname')
            .sort({ createdAt: 'desc' })

            .orFail(() => new NotFoundException('No posts'))
        return respuesta
    }

    deletePost = async (id: string, user?: UserInterface) => {
        validateObjectId(id, 'Invalid post id')
        const post = await this.postModel.findById(id)
        if (!post || !(user && (post.author).toString() === user.id)) {
            throw new ForbiddenException('Post not found or unauthorized')
        }
        const response = await this.postModel.findOneAndDelete({ '_id': id })
        return response
    }

    likePost = async (postId: string, userId: string): Promise<Boolean> => {
        await this.postModel.findByIdAndUpdate(postId, { $push: { likesArr: userId }, $inc: { likesNumb: 1 } })
        return true
    }

    dislikePost = async (postId: string, userId: string): Promise<Boolean> => {
        await this.postModel.findByIdAndUpdate(postId, { $pull: { likesArr: userId }, $inc: { likesNumb: -1 } })
        return false
    }

    addCommentToPost = async (postId: string, commentId: string) => {
        try {
            await this.postModel.findByIdAndUpdate(postId, { $push: { commentsArr: commentId }, $inc: { commentsNumb: 1 } })
        } catch (error) {
            console.log(error)
        }
    }

    removeCommentToPost = async (postId: string, commentId: string) => {
        try {
            await this.postModel.findByIdAndUpdate(postId, { $pull: { commentsArr: commentId }, $inc: { commentsNumb: -1 } })
        } catch (error) {
            console.log(error)
        }
    }

    findByFollowPost = async (followArr: string[]) => {
        const response = await this.postModel.find({ "author": { "$in": followArr } }).populate('author', 'profilePicture _id name surname')
        return response
    }
}
