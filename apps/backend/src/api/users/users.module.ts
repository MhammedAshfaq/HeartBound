import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DBModule } from '../../db/db.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DBModule,
    AuthModule, // provides JwtModule + JwtStrategy for AuthGuard('jwt')
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
