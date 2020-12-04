import { Document } from 'mongoose'

enum enumRoles {
    AUTHOR = "AUTHOR",
    ADMIN = "ADMIN"
}

export interface UserInterface extends Document {
    name: string
    surname: string
    profilePicture: string
    email: string
    password: string
    roles: enumRoles[]
}