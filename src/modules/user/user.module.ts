import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { MoviesModule } from '../movies/movies.module';
import { MonobankModule } from '../../integrations/monobank/monobank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => MoviesModule),
    forwardRef(() => MonobankModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
