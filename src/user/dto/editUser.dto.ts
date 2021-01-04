import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class editUserDTO {

    @ApiProperty()
    @IsOptional()
    name: string

    @ApiProperty()
    @IsOptional()
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