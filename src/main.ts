import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { createPinoLogger } from './core/logger/createPinoLogger';
import { PinoLogger } from './core/logger/PinoLogger';

async function bootstrap() {
  const pinoLogger = new PinoLogger();
  const logger = createPinoLogger();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: pinoLogger,
  });
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
  // Graceful shutdown handler
  const gracefulShutdown = async (signal: string) => {
    logger.warn(`${signal} received, shutting down gracefully...`);
    await app.close();
    process.exit(0);
  };

  // Process error handlers
  process.on('uncaughtException', (error: Error) => {
    logger.error(
      {
        message: error.message,
        stack: error.stack,
      },
      'Uncaught Exception',
    );
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason: any) => {
    logger.error(
      {
        reason: String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      },
      'Unhandled Rejection',
    );
    gracefulShutdown('unhandledRejection');
  });
  await app.listen(4000, () => {
    logger.info(`Server is running on port 4000`);
  });
}
bootstrap();
