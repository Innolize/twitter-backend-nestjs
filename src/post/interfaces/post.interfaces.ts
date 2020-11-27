import { Document } from 'mongoose'

export interface Post extends Document {
    authorId: string,
    comment: string
}
