import { IsString } from 'class-validator'

export class createCommentDTO {

    @IsString()
    postId: string

    @IsString()
    message: string
}