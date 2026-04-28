import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import pino from 'pino';
import { CustomError } from './CustomError';
import { createPinoLogger } from './createPinoLogger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger: pino.Logger;

  constructor() {
    this.logger = createPinoLogger();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let error = 'Internal Server Error';

    if (exception instanceof CustomError) {
      statusCode = exception.statusCode;
      message = exception.message;
      error = exception.name;

      this.logger.warn(
        {
          url: request.url,
          method: request.method,
          statusCode,
          errorName: error,
        },
        message,
      );
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      } else {
        message = exceptionResponse as string;
      }

      this.logger.warn(
        {
          url: request.url,
          method: request.method,
          statusCode,
        },
        message,
      );
    } else if (exception instanceof Error) {
      this.logger.error(
        {
          url: request.url,
          method: request.method,
          errorMessage: exception.message,
          stack: exception.stack,
        },
        'Unhandled Error',
      );
    } else {
      this.logger.error(
        {
          url: request.url,
          method: request.method,
          error: JSON.stringify(exception),
        },
        'Unknown Error',
      );
    }

    response.status(statusCode).json({
      statusCode,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
