import { IsOptional, IsString, MinLength } from 'class-validator'

export class createPostDTO {

    @IsString()
    readonly authorId: string

    @IsString()
    @MinLength(4)
    readonly message: string
}

export class updatePostDTO {
    @IsOptional()
    @IsString()
    authorId: string

    @IsOptional()
    @IsString()
    @MinLength(4)
    message: string
}