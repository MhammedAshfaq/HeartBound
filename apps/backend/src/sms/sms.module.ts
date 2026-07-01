import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioProvider } from './providers/twilio.provider';
import { ConsoleMockProvider } from './providers/console-mock.provider';

@Module({
  providers: [SmsService, TwilioProvider, ConsoleMockProvider],
  exports: [SmsService],
})
export class SmsModule {}
