import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class loginDTO {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}