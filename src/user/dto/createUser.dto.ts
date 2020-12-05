import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class createUserDTO {

    @ApiProperty()
    @IsString()
    readonly name: string

    @ApiProperty()
    @IsString()
    readonly surname: string

    @ApiProperty()
    @IsOptional()
    readonly profilePicture: string | null

    @ApiProperty()
    @IsString()
    readonly email: string

    @ApiProperty()
    @IsString()
    readonly password: string
}