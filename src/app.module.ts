import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { UserModule } from './modules/user/user.module';
import {AuthModule} from "./modules/auth/auth.module";
import { TripModule } from './modules/trip/trip.module';
import { CarModule } from './modules/car/car.module';
import { FuelModule } from './modules/fuel/fuel.module';
import { AnalysisModule } from './analysis/analysis.module';
import { AccountModule } from './modules/account/account.module';
import { CategoryModule } from './modules/category/category.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { MoviesModule } from './modules/movies/movies.module';
import { SeriesModule } from './modules/series/series.module';
import {WorkoutsModule} from "./modules/workout/workout.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get<string>('POSTGRES_DB_HOST'),
              port: configService.get<number>('POSTGRES_DB_PORT'),
              username: configService.get<string>('POSTGRES_DB_USERNAME'),
              password: configService.get<string>('POSTGRES_DB_PASSWORD'),
              database: configService.get<string>('POSTGRES_DB_NAME'),
              autoLoadEntities: true,
              synchronize: true,
              logging: true,
          }),
      }),
      UserModule,
      AuthModule,
      TripModule,
      CarModule,
      FuelModule,
      AnalysisModule,
      AccountModule,
      CategoryModule,
      TransactionModule,
      MaintenanceModule,
      MoviesModule,
      SeriesModule,
      WorkoutsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
