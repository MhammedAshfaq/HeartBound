import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  handleError(error: any, context?: string): void {
    console.error(`[${context || 'ErrorHandler'}]:`, error.message || error);
  }
}
