# Back end de red social (estilo twitter)

RESTful API creada con NestJS para una red social, que permite creación de usuarios, posts, comentarios y subir imágenes. Utiliza MongoDB como base de datos, para el sistema de logeo se utiliza passport y para el almacenamiento de imágenes utiliza amazon s3.

## Pasos para correr el proyecto:

Cambiar el contenido del archivo ".env.dist" por las variables de entorno necesarias y cambiar luego cambiar el nombre a ".env"

Para instalar dependencias y corre el proyecto en modo desarrollador:

``` 
yarn start:dev
```

Luego de esto, podrías hacer consultas a http://localhost:4000.




## Tecnologías utilizadas:

* NestJS
* Typescript
* Mongoose
* Passport
* Socket.io
* Amazon S3
