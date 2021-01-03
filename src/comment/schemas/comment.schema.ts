import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { User } from "src/user/schemas/user.schema";

export type CommentInterface = Comment & mongoose.Document

@Schema({ timestamps: true })
export class Comment {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    postId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    authorId: string

    @Prop({ required: true })
    message: string

    @Prop({ default: [] })
    likes: string[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment)