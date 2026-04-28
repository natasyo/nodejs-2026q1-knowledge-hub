import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';
import { createPinoLogger } from './createPinoLogger';

@Injectable()
export class PinoLogger implements LoggerService {
  private logger: pino.Logger;
  private context: string = 'App';

  constructor() {
    this.logger = createPinoLogger();
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void {
    const ctx = context || this.context;
    this.logger.info({ context: ctx }, message);
  }

  debug(message: string, context?: string): void {
    const ctx = context || this.context;
    this.logger.debug({ context: ctx }, message);
  }

  warn(message: string, context?: string): void {
    const ctx = context || this.context;
    this.logger.warn({ context: ctx }, message);
  }

  error(message: string, trace?: string, context?: string): void {
    const ctx = context || this.context;
    const meta: any = { context: ctx };
    if (trace) {
      meta.stack = trace;
    }
    this.logger.error(meta, message);
  }

  verbose(message: string, context?: string): void {
    const ctx = context || this.context;
    this.logger.trace({ context: ctx }, message);
  }
}
