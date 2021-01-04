import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
    constructor(
        @InjectS3()
        private readonly s3: S3,
        private readonly configService: ConfigService
    ) { }

    async uploadProfileImage(file: Express.Multer.File) {

        this.validateImage(file)

        const fileExtention = (file.originalname).split(".").pop()
        const newImageId = uuidv4()
        const key = `Profile-Image/${newImageId}.${fileExtention}`

        try {
            await this.s3.putObject({ Bucket: "inno-twitt", Key: key, Body: file.buffer }).promise()
            const imageUrl = `${this.configService.get<string>("AWS_URL_BUCKET")}` + key
            console.log("profile: ", imageUrl)
            return imageUrl
        } catch (err) {
            return err
        }
    }

    async uploadCoverImage(file: Express.Multer.File) {

        this.validateImage(file)

        const fileExtention = (file.originalname).split(".").pop()
        const newImageId = uuidv4()
        const key = `Cover-Image/${newImageId}.${fileExtention}`

        try {
            await this.s3.putObject({ Bucket: "inno-twitt", Key: key, Body: file.buffer }).promise()
            const imageUrl = `${this.configService.get<string>("AWS_URL_BUCKET")}` + key
            console.log("cover: ", imageUrl)
            return imageUrl
        } catch (err) {
            return err
        }

    }

    validateImage(file: Express.Multer.File) {
        const validImageType = (file.mimetype).indexOf('image') === 0

        if (!validImageType) {
            throw new UnsupportedMediaTypeException()
        }
    }

}
