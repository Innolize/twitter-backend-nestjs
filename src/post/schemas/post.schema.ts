import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/user/schemas/user.schema'

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    authorId: User

    @Prop({ required: true })
    message: string
}

export const PostSchema = SchemaFactory.createForClass(Post)