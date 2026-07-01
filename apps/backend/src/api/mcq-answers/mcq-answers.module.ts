import { Module } from '@nestjs/common';
import { McqAnswersController } from './mcq-answers.controller';
import { McqAnswersService } from './mcq-answers.service';
import { DBModule } from '../../db/db.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DBModule,
    AuthModule, // provides JwtModule + JwtStrategy for AuthGuard('jwt')
  ],
  controllers: [McqAnswersController],
  providers: [McqAnswersService],
  exports: [McqAnswersService],
})
export class McqAnswersModule {}
