import { IsString, MaxLength, MinLength } from 'class-validator'

export class createCommentDTO {

    @IsString()
    postId: string

    @IsString()
    @MinLength(4)
    @MaxLength(140)
    message: string
}