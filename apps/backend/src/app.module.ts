import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EnvConfigModule } from '@config/env-config.module';
import { LoggerModule } from '@logger/logger.module';
import { RedisModule } from '@redis/redis.module';
import { DBModule } from '@db/db.module';
import { OtelModule } from '@otel/otel.module';
import { HealthModule } from '@health/health.module';
import { AuthModule } from '@auth/auth.module';
import { AdminModule } from '@admin/admin.module';
import { CountriesModule } from './api/countries/countries.module';
import { UsersModule } from './api/users/users.module';
import { McqAnswersModule } from './api/mcq-answers/mcq-answers.module';
import { ErrorHandlerService } from '@common/services/error-handler.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { DevToolsController } from './api/dev-tools/dev-tools.controller';
import { HuggingFaceModule } from 'api/huggingface/huggingface.module';

const rateLimit = ThrottlerModule.forRoot([
  { name: 'short', ttl: 1 * 60, limit: 30 },
  { name: 'medium', ttl: 5 * 60, limit: 100 },
  { name: 'long', ttl: 30 * 60, limit: 500 },
]);

@Module({
  imports: [
    rateLimit,
    EnvConfigModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    RedisModule,
    DBModule,
    OtelModule,
    HealthModule,
    AuthModule,
    AdminModule,
    CountriesModule,
    UsersModule,
    McqAnswersModule,
    HuggingFaceModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
  ],
  controllers: [DevToolsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ErrorHandlerService,
  ],
})
export class AppModule {}

