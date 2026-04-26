import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удалит поля, которых нет в DTO
      forbidNonWhitelisted: true, // выдаст ошибку, если переданы лишние поля
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Documentation')
    .setDescription('Documentation')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, doc);
  app.useLogger(app.get(Logger));
  await app.listen(4000);
}
bootstrap();
