import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class createPostDTO {

    @ApiProperty()
    @IsString()
    readonly authorId: string

    @ApiProperty()
    @IsString()
    @MinLength(4)
    readonly message: string
}

export class updatePostDTO {
    @ApiProperty()
    @IsOptional()
    @IsString()
    authorId: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(4)
    message: string
}