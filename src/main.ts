import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);
  await app.listen(4000);
}
bootstrap();
