import { Document } from 'mongoose'

export interface Post extends Document {
    author: string,
    comment: string
    likesArr: string[]
    likesNumb: number
    commentsArr: string[]
    commentsNumb: number
}
