import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HookNextFunction } from 'mongoose'
import { hash } from 'bcrypt'
import { UserInterface } from '../interfaces/user.interface'
import { AppRole, roles } from 'src/app.roles'

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    surname: string

    @Prop({ default: null })
    bio: string

    @Prop({ default: null })
    profilePicture: string

    @Prop({ default: null })
    cover: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true, select: false })
    password: string

    @Prop({ required: true, default: [AppRole.AUTHOR] })
    roles: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next: HookNextFunction) {
    const user = this as UserInterface
    if (user.password) {
        user.password = await hash(user.password, 10)
    }
})