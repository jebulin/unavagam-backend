import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from "express-basic-auth";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(morgan('combined'));

  app.setGlobalPrefix('/api');

  app.use(json({ limit: '50mb' }));

  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(['/docs', '/docs-json'], basicAuth({
    challenge: true,
    users: {
      'unavagam': "1234"
    },
  }));

  const config = new DocumentBuilder().addBearerAuth()
    .setTitle("Risk management backend")
    .setDescription('backends api')
    .build();

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )


  await app.listen(3000);
}
bootstrap();
