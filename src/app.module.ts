import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { UserModule } from './user/user.module';
import {AuthModule} from "./auth/auth.module";
import { TripModule } from './trip/trip.module';
import { CarModule } from './car/car.module';
import { FuelModule } from './fuel/fuel.module';
import { AnalysisModule } from './analysis/analysis.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

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
      MaintenanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
