import { IsString } from 'class-validator'

export class createCommentDTO {
    @IsString()
    author: string

    @IsString()
    message: string
}