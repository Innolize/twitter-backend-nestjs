import { IsIn, IsOptional } from 'class-validator'
import { Express } from 'express'

export class EditUserFiles {
    @IsOptional()
    profile: Express.Multer.File[]

    @IsOptional()
    cover: Express.Multer.File[]
}