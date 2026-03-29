import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitLog } from './entities/habit-log.entity';
import { Habit } from './entities/habit.entity';
import { HabitLogDto } from './dto/log-habit.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HabitLogService {
  private readonly logger = new Logger(HabitLogService.name);

  constructor(
    @InjectRepository(HabitLog)
    private readonly logRepo: Repository<HabitLog>,
    @InjectRepository(Habit)
    private readonly habitRepo: Repository<Habit>,
  ) {}

  async markCompleted(userId: number, habitId: number, dto: HabitLogDto) {
    const habit = await this.habitRepo.findOne({ where: { habit_id: habitId, user_id: userId } });
    if (!habit) throw new NotFoundException('Habit not found');

    const existing = await this.logRepo.findOne({ where: { habit_id: habitId, date: dto.date } });
    if (existing) throw new ConflictException('Habit already logged for this day');

    // Create log
    const log = this.logRepo.create({
      ...dto,
      habit_id: habitId,
      user_id: userId,
    });
    await this.logRepo.save(log);

    // Update Cached Stats
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    habit.total_completions += 1;

    if (habit.last_logged_date === yesterdayStr) {
      habit.current_streak += 1;
    } else if (!habit.last_logged_date || habit.last_logged_date < yesterdayStr) {
      habit.current_streak = 1;
    }

    if (habit.current_streak > habit.longest_streak) {
      habit.longest_streak = habit.current_streak;
    }

    habit.last_logged_date = dto.date;
    await this.habitRepo.save(habit);

    return log;
  }

  async unmarkCompleted(userId: number, habitId: number, date: string) {
    const log = await this.logRepo.findOne({ where: { habit_id: habitId, user_id: userId, date } });
    if (!log) throw new NotFoundException('Log not found');

    await this.logRepo.remove(log);

    const habit = await this.habitRepo.findOne({ where: { habit_id: habitId } });
    if (habit) {
      habit.total_completions = Math.max(0, habit.total_completions - 1);
      await this.habitRepo.save(habit);
    }

    return { success: true };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetLapsedStreaks() {
    this.logger.log('Starting CRON: Resetting lapsed streaks...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const result = await this.habitRepo
      .createQueryBuilder()
      .update(Habit)
      .set({ current_streak: 0 })
      .where('is_active = :isActive', { isActive: true })
      .andWhere('last_logged_date < :yesterday', { yesterday: yesterdayStr })
      .andWhere('current_streak > 0')
      .execute();

    this.logger.log(`Reset streaks for ${result.affected} habits.`);
  }

  async getStats(userId: number, habitId: number) {
    const habit = await this.habitRepo.findOne({ where: { habit_id: habitId, user_id: userId } });
    if (!habit) throw new NotFoundException('Habit not found');

    return {
      totalCompletions: habit.total_completions,
      currentStreak: habit.current_streak,
      longestStreak: habit.longest_streak,
      lastLoggedDate: habit.last_logged_date,
    };
  }
}
