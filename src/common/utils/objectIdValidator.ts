import { BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

// Toma un string y verifica si puede ser convertido a ObjectId en la database de mongodb,
// de lo contrario devuelve error con mensaje pasado como segundo parametro

export default function validateObjectId(id: string, errorMsg: string) {
    const isValid = Types.ObjectId.isValid(id)

    if (!isValid) {
        throw new BadRequestException(`${errorMsg}`)
    }
}