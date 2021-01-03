import { IsString } from 'class-validator'

export class editCommentDTO {

    @IsString()
    message: string
}