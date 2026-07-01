import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

const METHOD_MESSAGES: Record<string, string> = {
  GET: 'Fetched successfully',
  POST: 'Created successfully',
  PATCH: 'Updated successfully',
  PUT: 'Updated successfully',
  DELETE: 'Deleted successfully',
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const method: string = request.method?.toUpperCase() ?? 'GET';

    return next.handle().pipe(
      map((data) => {
        // Allow individual controllers to override the message by returning { message, ...rest }
        const message: string =
          data && typeof data === 'object' && typeof data.message === 'string'
            ? data.message
            : METHOD_MESSAGES[method] ?? 'Success';

        return {
          success: true as const,
          message,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
