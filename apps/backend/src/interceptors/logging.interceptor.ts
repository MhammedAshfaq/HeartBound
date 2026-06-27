import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    const formattedBody = Object.keys(body || {}).length ? JSON.stringify(body) : null;
    const formattedQuery = Object.keys(query || {}).length ? JSON.stringify(query) : null;
    const formattedParams = Object.keys(params || {}).length ? JSON.stringify(params) : null;

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
