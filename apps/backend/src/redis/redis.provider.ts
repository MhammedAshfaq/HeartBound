import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST') || '127.0.0.1';
    const port = configService.get<number>('REDIS_PORT') || 6379;
    const password = configService.get<string>('REDIS_PASSWORD') || undefined;
    return new Redis({ host, port, password, retryStrategy: (times) => Math.min(times * 50, 2000) });
  },
  inject: [ConfigService],
};
