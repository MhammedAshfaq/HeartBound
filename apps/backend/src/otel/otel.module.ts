import { Module } from '@nestjs/common';
import { OTelService } from './otel.service';

@Module({
  providers: [OTelService],
  exports: [OTelService],
})
export class OtelModule {}
