import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AiLimiterService } from './ai-limiter.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly aiLimiterService: AiLimiterService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.ip || request.headers['x-forwarded-for'];
    const LIMIT = 2;
    const TTL = 60000;
    const allowed = this.aiLimiterService.isAllowed(key, LIMIT, TTL);
    if (!allowed) {
      throw new HttpException(
        'Слишком много запросов. Попробуйте позже.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
