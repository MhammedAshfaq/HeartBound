import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  private sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    const sanitized = { ...obj };
    const sensitiveKeys = [
      'code',
      'token',
      'password',
      'accessToken',
      'refreshToken',
      'clientSecret',
      'client_secret',
    ];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.includes(key)) {
        sanitized[key] = '***';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitize(sanitized[key]);
      }
    }

    return sanitized;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    const sanitizedBody = this.sanitize(body);
    const sanitizedQuery = this.sanitize(query);
    const sanitizedParams = this.sanitize(params);

    const formattedBody = Object.keys(sanitizedBody || {}).length ? JSON.stringify(sanitizedBody) : null;
    const formattedQuery = Object.keys(sanitizedQuery || {}).length ? JSON.stringify(sanitizedQuery) : null;
    const formattedParams = Object.keys(sanitizedParams || {}).length ? JSON.stringify(sanitizedParams) : null;

    this.logger.log(
      `[REQUEST] ▶▶▶ ${method} ${url}` +
      (formattedParams ? ` | Params: ${formattedParams}` : '') +
      (formattedQuery ? ` | Query: ${formattedQuery}` : '') +
      (formattedBody ? ` | Body: ${formattedBody}` : '')
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse();
          const duration = Date.now() - now;
          this.logger.log(`[RESPONSE] ◀◀◀ ${method} ${url} | Status: ${response.statusCode} | Duration: ${duration}ms`);
        },
        error: (err) => {
          const duration = Date.now() - now;
          const status = err?.status || err?.statusCode || 500;
          this.logger.error(`[RESPONSE ERROR] ◀◀◀ ${method} ${url} | Status: ${status} | Duration: ${duration}ms | Error: ${err?.message || err}`);
        }
      })
    );
  }
}
