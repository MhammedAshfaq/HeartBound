import { Module, Global } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisHealthIndicator } from './redis.health';

@Global()
@Module({
  providers: [redisProvider, RedisHealthIndicator],
  exports: [redisProvider, RedisHealthIndicator],
})
export class RedisModule {}
