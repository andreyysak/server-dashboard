import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_DB_HOST,
          port: Number(process.env.POSTGRES_DB_PORT),
          username: process.env.POSTGRES_DB_USERNAME,
          password: process.env.POSTGRES_DB_PASSWORD,
          database: process.env.POSTGRES_DB_NAME,
          synchronize: false,
          logging: true,
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
