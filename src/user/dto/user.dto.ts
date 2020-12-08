import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class createUserDTO {

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