import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/user/schemas/user.schema'

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User

    @Prop({ required: true })
    message: string

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    likesArr: User[]

    @Prop({ default: 0 })
    likesNumb: number

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Comments' })
    commentsArr: Comment[]

    @Prop({ default: 0 })
    commentsNumb: number
}

export const PostSchema = SchemaFactory.createForClass(Post)