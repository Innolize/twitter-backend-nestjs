import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module, S3ModuleAsyncOptions } from 'nestjs-s3'
import { UploadService } from './upload.service';

@Module({
  imports: [
    ConfigModule,
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get<string>("S3_ACCESS_KEY"),
          secretAccessKey: configService.get<string>("S3_SECRET_KEY")
        }
      }),
      inject: [ConfigService]
    })],
  providers: [UploadService],
  exports: [UploadService],

})
export class UploadModule { }
