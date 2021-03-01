import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class createUserDTO {

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    readonly name: string

    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    readonly surname: string

    @ApiProperty()
    @IsOptional()
    readonly profilePicture: string | null

    @ApiProperty()
    @IsString()
    @IsEmail()
    readonly email: string

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(30)
    readonly password: string
}