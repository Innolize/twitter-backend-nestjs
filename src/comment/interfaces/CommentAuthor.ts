import { CommentInterface } from '../schemas/comment.schema'
import { Types } from 'mongoose'

interface ShortenedAuthor {
    _id: string,
    name: string,
    surname: string,
    profilePicture: string | null,
}

export interface CommentAuthor extends Omit<CommentInterface, "author"> {
    author: ShortenedAuthor
}