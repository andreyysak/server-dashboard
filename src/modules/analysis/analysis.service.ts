import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../trip/entities/trip.entity';
import { Fuel } from '../fuel/entities/fuel.entity';
import { Maintenance } from '../maintenance/entities/maintenance.entity';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    @InjectRepository(Fuel)
    private readonly fuelRepo: Repository<Fuel>,
    @InjectRepository(Maintenance)
    private readonly maintenanceRepo: Repository<Maintenance>,
  ) {}

  async getTotalExpenses(
    userId: number,
    carId?: number,
    from?: string,
    to?: string,
  ) {
    const fuelQuery = this.fuelRepo
      .createQueryBuilder('fuel')
      .select('SUM(fuel.price)', 'total')
      .where('fuel.user_id = :userId', { userId });

    const maintenanceQuery = this.maintenanceRepo
      .createQueryBuilder('m')
      .select('SUM(m.cost)', 'total')
      .where('m.user_id = :userId', { userId });

    if (carId) {
      fuelQuery.andWhere('fuel.car_id = :carId', { carId });
      maintenanceQuery.andWhere('m.car_id = :carId', { carId });
    }

    if (from && to) {
      fuelQuery.andWhere('fuel.created_at BETWEEN :from AND :to', { from, to });
      maintenanceQuery.andWhere('m.created_at BETWEEN :from AND :to', {
        from,
        to,
      });
    }

    const { total: fuelTotal } = (await fuelQuery.getRawOne()) || { total: 0 };
    const { total: maintenanceTotal } = (await maintenanceQuery.getRawOne()) || {
      total: 0,
    };

    return {
      total: (parseFloat(fuelTotal) || 0) + (parseFloat(maintenanceTotal) || 0),
      fuel: parseFloat(fuelTotal) || 0,
      maintenance: parseFloat(maintenanceTotal) || 0,
    };
  }

  async getFuelStats(userId: number, carId?: number) {
    const query = this.fuelRepo
      .createQueryBuilder('fuel')
      .select('SUM(fuel.liters)', 'totalLiters')
      .addSelect('SUM(fuel.price)', 'totalCost')
      .where('fuel.user_id = :userId', { userId });

    if (carId) query.andWhere('fuel.car_id = :carId', { carId });

    const { totalLiters, totalCost } = (await query.getRawOne()) || {};

    const liters = parseFloat(totalLiters) || 0;
    const cost = parseFloat(totalCost) || 0;

    // Calculate consumption if trip data available
    let avgConsumption = null;
    let totalKm = 0;

    if (carId) {
      const tripQuery = this.tripRepo
        .createQueryBuilder('trip')
        .select('SUM(trip.kilometres)', 'totalKm')
        .where('trip.user_id = :userId', { userId })
        .andWhere('trip.car_id = :carId', { carId });

      const res = await tripQuery.getRawOne();
      totalKm = parseFloat(res?.totalKm) || 0;

      if (totalKm > 0 && liters > 0) {
        avgConsumption = (liters / totalKm) * 100;
      }
    }

    return {
      totalLiters: liters,
      totalCost: cost,
      avgPricePerLiter: liters > 0 ? cost / liters : 0,
      avgConsumption: avgConsumption
        ? parseFloat(avgConsumption.toFixed(2))
        : null,
      totalKm,
    };
  }

  async getMaintenanceStats(userId: number, carId?: number) {
    const query = this.maintenanceRepo
      .createQueryBuilder('m')
      .select('SUM(m.cost)', 'totalCost')
      .addSelect('COUNT(m.maintenance_id)', 'count')
      .where('m.user_id = :userId', { userId });

    if (carId) query.andWhere('m.car_id = :carId', { carId });

    const { totalCost, count } = (await query.getRawOne()) || {};

    const cost = parseFloat(totalCost) || 0;
    const cnt = parseInt(count) || 0;

    return {
      totalCost: cost,
      count: cnt,
      avgCost: cnt > 0 ? cost / cnt : 0,
    };
  }
}
