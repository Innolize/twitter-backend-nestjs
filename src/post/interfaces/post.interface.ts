import { Document } from 'mongoose'

export interface Post extends Document {
    author: string,
    comment: string
}
