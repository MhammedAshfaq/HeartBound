import { Module } from '@nestjs/common';
import { EnvConfigModule } from '@config/env-config.module';
import { LoggerModule } from '@logger/logger.module';
import { RedisModule } from '@redis/redis.module';
import { DBModule } from '@db/db.module';

@Module({
  imports: [EnvConfigModule, LoggerModule, RedisModule, DBModule],
})
export class WorkerModule {}
