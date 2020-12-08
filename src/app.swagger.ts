import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export function swaggerInit(app) {
    const options = new DocumentBuilder()
        .setTitle('Twitter back-end API')
        .setDescription('Twitter back-end API description')
        .setVersion('1.0')
        .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)
}