import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt-token.service';
import { DBModule } from '../../db/db.module';
import { RedisModule } from '../../redis/redis.module';
import { SmsModule } from '../../sms/sms.module';

@Module({
  imports: [
    DBModule,
    RedisModule,
    SmsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey_heartbond_secure_2026_xYz',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtTokenService],
  exports: [AuthService, JwtModule, JwtTokenService],
})
export class AuthModule {}
