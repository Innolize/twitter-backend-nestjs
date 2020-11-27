import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string

    @Prop()
    surname: string

    @Prop({ default: null, required: true })
    profilePicture: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string
}