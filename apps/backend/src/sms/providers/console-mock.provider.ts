import { Injectable, Logger } from '@nestjs/common';
import { SmsProvider } from '../interfaces/sms-provider.interface';

@Injectable()
export class ConsoleMockProvider implements SmsProvider {
  readonly name = 'ConsoleMockProvider';
  private readonly logger = new Logger(ConsoleMockProvider.name);

  async sendSms(to: string, body: string): Promise<boolean> {
    this.logger.log(`[MOCK SMS] To: ${to} | Body: ${body}`);
    return true;
  }
}
