import pinoHttp from 'pino-http';
import { sanitizeLogs } from './sanitizeLogs';
import { createPinoLogger } from './createPinoLogger';

export function createHttpLogger() {
  const logger = createPinoLogger();

  return pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      responseTime: 'duration',
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: sanitizeLogs(req.headers),
        query: sanitizeLogs(req.query),
        body: sanitizeLogs(req.body),
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: res.getHeaders(),
      }),
      err: (err) => ({
        message: err.message,
        stack: err.stack,
        statusCode: (err as any).statusCode || 500,
      }),
    },
    autoLogging: {
      ignore: (req) => {
        // Skip logging for health checks and docs
        return req.url.includes('/health') || req.url.includes('/docs');
      },
    },
  });
}
