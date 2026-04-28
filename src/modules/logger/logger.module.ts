import { Module } from '@nestjs/common';
import { PinoLogger } from '../../core/logger/PinoLogger';

@Module({
  exports: [PinoLogger],
  providers: [PinoLogger],
})
export class LoggerModule {}
