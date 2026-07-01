import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { SmsProvider } from './interfaces/sms-provider.interface';
import { TwilioProvider } from './providers/twilio.provider';
import { ConsoleMockProvider } from './providers/console-mock.provider';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private activeProvider: SmsProvider;

  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly twilioProvider: TwilioProvider,
    private readonly consoleMockProvider: ConsoleMockProvider,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const fromNumber = this.configService.get<string>('TWILIO_FROM_NUMBER');

    if (accountSid && authToken && fromNumber) {
      this.activeProvider = this.twilioProvider;
      this.logger.log(`Active SMS Provider configured: ${this.activeProvider.name}`);
    } else {
      this.activeProvider = this.consoleMockProvider;
      this.logger.warn(
        `Twilio credentials missing. Falling back to active SMS Provider: ${this.activeProvider.name}`,
      );
    }
  }

  async sendSms(to: string, body: string): Promise<boolean> {
    try {
      return await this.activeProvider.sendSms(to, body);
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${to} using provider ${this.activeProvider.name}:`,
        error,
      );

      /*
       * FUTURE ROADMAP: SMS PROVIDER FALLBACK & ROLLBACK CHAIN
       * If your primary SMS provider (e.g., Twilio) fails or reaches its rate limit,
       * you can catch the error here and automatically retry using alternate providers.
       *
       * Example setup:
       * 1. Define new providers implementing the `SmsProvider` interface (e.g., Msg91Provider, AwsSnsProvider).
       * 2. Inject them into the constructor of this service.
       * 3. Loop through them in case the primary one throws an error:
       *
       * const fallbacks = [this.msg91Provider, this.awsSnsProvider];
       * for (const provider of fallbacks) {
       *   try {
       *     this.logger.log(`Attempting SMS rollback delivery via: ${provider.name}`);
       *     const success = await provider.sendSms(to, body);
       *     if (success) return true;
       *   } catch (fallbackError) {
       *     this.logger.error(`Rollback SMS delivery failed for ${provider.name}:`, fallbackError);
       *   }
       * }
       */

      throw error;
    }
  }
}
