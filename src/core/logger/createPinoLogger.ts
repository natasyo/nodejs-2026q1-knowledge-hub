import pino from 'pino';
import * as fs from 'fs';
import * as path from 'path';

export function createPinoLogger(): pino.Logger {
  const logLevel = process.env.LOG_LEVEL || 'info';
  const nodeEnv = process.env.NODE_ENV || 'development';
  const logDir = 'logs';

  // Ensure logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const baseOptions: pino.LoggerOptions = {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    hooks: {
      logMethod(inputArgs, method) {
        return method.apply(this, inputArgs);
      },
    },
    formatters: {
      level: (label) => {
        return { level: label };
      },
      bindings: (bindings) => {
        return { pid: bindings.pid };
      },
      log: (object: any) => {
        console.log('Обрабатываем объект лога:', object);
        if (object.msg && typeof object.msg === 'object') {
          // 1. Пытаемся вытащить текст: сначала из message, потом из type (как в вашем логе), иначе JSON
          const message =
            object.msg.message ||
            object.msg.type ||
            (typeof object.msg === 'string'
              ? object.msg
              : JSON.stringify(object.msg));

          // 2. Сохраняем исходный объект в err_details, чтобы не потерять контекст
          return {
            ...object,
            msg: message,
            err_details: object.msg,
          };
        }
        return object;
      },
    },
  };

  if (nodeEnv === 'development') {
    // Human-readable format for development
    const transport = pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: false,
        translateTime: 'SYS:standard',
        ignore: 'pid',
        messageFormat: '[{context}] {msg}',
      },
    });

    return pino(baseOptions, transport);
  } else {
    // Structured JSON format for production with file rotation
    const fileTransport = pino.transport({
      target: 'pino-roll',
      options: {
        file: path.join(logDir, 'app.log'),
        frequency: 'size',
        size: `${parseInt(process.env.LOG_MAX_FILE_SIZE || '1024', 10)}k`,
        mkdir: true,
      },
    });

    return pino(baseOptions, fileTransport);
  }
}
