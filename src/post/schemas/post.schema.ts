import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Post {
    @Prop({ required: true })
    authorId: string

    @Prop({required: true})
    message: string
}

export const PostSchema = SchemaFactory.createForClass(Post)