import { Module, Global } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisHealthIndicator } from './redis.health';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [redisProvider, RedisHealthIndicator, CacheService],
  exports: [redisProvider, RedisHealthIndicator, CacheService],
})
export class RedisModule {}
