import { Module } from '@nestjs/common';
import { FeelingsController } from './feelings.controller';
import { FeelingsService } from './feelings.service';
import { DBModule } from '../../db/db.module';

@Module({
  imports: [DBModule],
  controllers: [FeelingsController],
  providers: [FeelingsService],
  exports: [FeelingsService],
})
export class FeelingsModule {}
