import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

export type CommentInterface = Comment & Document

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    author: string

    @Prop({ required: true })
    message: string

    @Prop({ default: [] })
    likes: string[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment)