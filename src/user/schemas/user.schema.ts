import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HookNextFunction } from 'mongoose'
import { hash } from 'bcrypt'
import { UserInterface } from '../interfaces/user.interface'

@Schema({ timestamps: true })
export class User {
    // @Prop({ required: true })
    // name: string

    // @Prop()
    // surname: string

    @Prop({ default: null })
    profilePicture: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next: HookNextFunction) {
    const user = this as UserInterface
    if (user.password) {
        user.password = await hash(user.password, 10)
    }
})