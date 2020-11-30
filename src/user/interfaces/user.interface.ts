import { Document } from 'mongoose'

export interface UserInterface extends Document {
    name: string
    surname: string
    profilePicture: string
    email: string
    password: string
}