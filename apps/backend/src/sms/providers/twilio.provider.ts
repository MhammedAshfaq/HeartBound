import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { SmsProvider } from '../interfaces/sms-provider.interface';
import twilio from 'twilio';

@Injectable()
export class TwilioProvider implements SmsProvider {
  readonly name = 'TwilioProvider';
  private readonly logger = new Logger(TwilioProvider.name);
  private readonly client?: twilio.Twilio;
  private readonly fromNumber?: string;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_FROM_NUMBER');

    if (accountSid && authToken && this.fromNumber) {
      this.client = twilio(accountSid, authToken);
    }
  }

  async sendSms(to: string, body: string): Promise<boolean> {
    if (!this.client || !this.fromNumber) {
      this.logger.warn('Twilio provider cannot send SMS: credentials are not configured.');
      return false;
    }

    try {
      await this.client.messages.create({
        body,
        from: this.fromNumber,
        to,
      });
      this.logger.log(`SMS successfully sent to ${to} via Twilio.`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to} via Twilio:`, error);
      throw error;
    }
  }
}
