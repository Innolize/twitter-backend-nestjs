import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class editUserDTO {

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    surname: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    profilePicture: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    cover: string



    // @ApiProperty()
    // @IsOptional()
    // email: string

    // @ApiProperty()
    // @IsOptional()
    // password: string
}