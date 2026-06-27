import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHandlerService } from '../services/error-handler.service';

import { ERROR_MESSAGES } from '@common/constants/error-messages.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorHandler?: ErrorHandlerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (this.errorHandler) {
      this.errorHandler.handleError(exception, 'HttpExceptionFilter');
    }

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        path: request.url,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
