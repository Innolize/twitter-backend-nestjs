import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

export class editUserDTO {

    @ApiProperty()
    @IsOptional()
    profilePicture: string

    @ApiProperty()
    @IsOptional()
    email: string

    @ApiProperty()
    @IsOptional()
    password: string
}