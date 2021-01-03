import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class createPostDTO {

    @ApiProperty()
    @IsString()
    @MinLength(4)
    readonly message: string
}

export class updatePostDTO {

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(4)
    message: string
}

export class userPostsDTO {

    @ApiProperty()
    @IsString()
    userId: string
}