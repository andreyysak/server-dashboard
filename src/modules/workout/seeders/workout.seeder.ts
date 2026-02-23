import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from '../entities/workout.entity';
import { Exercise } from '../entities/exercise.entity';
import {WorkoutType} from "../enums/workout-type.enums";

@Injectable()
export class WorkoutsSeeder {
    constructor(
        @InjectRepository(Workout)
        private readonly workoutRepository: Repository<Workout>,
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
    ) {}

    async seed(userId: number = 1) {
        const workoutsData = [
            {
                title: 'Ранкова силовий тренінг: Груди та Тріцепс',
                type: WorkoutType.GYM,
                duration_minutes: 75,
                notes: 'Гарний темп, збільшив вагу в жимі.',
                exercises: [
                    { name: 'Жим штанги лежачи', sets: 4, reps: 10, weight: 80 },
                    { name: 'Розведення гантелей', sets: 3, reps: 12, weight: 16 },
                    { name: 'Французький жим', sets: 3, reps: 10, weight: 30 },
                    { name: 'Віджимання на брусах', sets: 3, reps: 15 }
                ]
            },
            {
                title: 'Вечірня пробіжка в парку',
                type: WorkoutType.CARDIO,
                duration_minutes: 45,
                notes: 'Легкий біг для відновлення.',
                exercises: [
                    { name: 'Біг', distance_km: 7.5, duration_seconds: 2700 }
                ]
            },
            {
                title: 'Футбол з друзями',
                type: WorkoutType.FOOTBALL,
                duration_minutes: 90,
                notes: 'Висока інтенсивність, забив 2 голи.',
                exercises: [
                    { name: 'Гра в футбол', duration_seconds: 5400 }
                ]
            },
            {
                title: 'Плавання в басейні',
                type: WorkoutType.SWIMMING,
                duration_minutes: 60,
                notes: 'Акцент на техніку кроля.',
                exercises: [
                    { name: 'Кроль', distance_km: 1.5, duration_seconds: 3000 },
                    { name: 'Брас', distance_km: 0.5, duration_seconds: 600 }
                ]
            },
            {
                title: 'Тренування вдома: Full Body',
                type: WorkoutType.HOME,
                duration_minutes: 40,
                notes: 'Мінімальний відпочинок між підходами.',
                exercises: [
                    { name: 'Присідання', sets: 4, reps: 20 },
                    { name: 'Віджимання', sets: 4, reps: 15 },
                    { name: 'Планка', sets: 3, duration_seconds: 60 },
                    { name: 'Берпі', sets: 3, reps: 12 }
                ]
            },
            {
                title: 'День ніг у залі',
                type: WorkoutType.GYM,
                duration_minutes: 80,
                exercises: [
                    { name: 'Присідання зі штангою', sets: 4, reps: 8, weight: 100 },
                    { name: 'Жим ногами', sets: 3, reps: 12, weight: 160 },
                    { name: 'Випади з гантелями', sets: 3, reps: 12, weight: 20 }
                ]
            },
            {
                title: 'Йога для спини',
                type: WorkoutType.YOGA,
                duration_minutes: 30,
                exercises: [
                    { name: 'Розтяжка та асани', duration_seconds: 1800 }
                ]
            },
            {
                title: 'Спина та Біцепс',
                type: WorkoutType.GYM,
                duration_minutes: 70,
                exercises: [
                    { name: 'Підтягування', sets: 4, reps: 10 },
                    { name: 'Тяга штанги в нахилі', sets: 4, reps: 10, weight: 60 },
                    { name: 'Згинання рук з гантелями', sets: 3, reps: 12, weight: 14 }
                ]
            },
            {
                title: 'Кардіо: Велосипед',
                type: WorkoutType.CARDIO,
                duration_minutes: 120,
                exercises: [
                    { name: 'Велозаїзд за містом', distance_km: 40, duration_seconds: 7200 }
                ]
            },
            {
                title: 'Інтервальний біг',
                type: WorkoutType.CARDIO,
                duration_minutes: 35,
                exercises: [
                    { name: 'Інтервали 400м', distance_km: 5, duration_seconds: 2100 }
                ]
            },
            {
                title: 'Плечі: Тренування в залі',
                type: WorkoutType.GYM,
                duration_minutes: 60,
                exercises: [
                    { name: 'Армійський жим', sets: 4, reps: 8, weight: 50 },
                    { name: 'Махи гантелями в сторони', sets: 3, reps: 15, weight: 10 }
                ]
            },
            {
                title: 'Швидке тренування пресу',
                type: WorkoutType.HOME,
                duration_minutes: 15,
                exercises: [
                    { name: 'Скручування', sets: 3, reps: 30 },
                    { name: 'Підйом ніг', sets: 3, reps: 20 }
                ]
            },
            {
                title: 'Плавання: Дистанція',
                type: WorkoutType.SWIMMING,
                duration_minutes: 50,
                exercises: [
                    { name: 'Кроль без зупинки', distance_km: 2, duration_seconds: 2800 }
                ]
            },
            {
                title: 'Кросфіт сесія',
                type: WorkoutType.OTHER,
                duration_minutes: 45,
                exercises: [
                    { name: 'Станова тяга', sets: 5, reps: 5, weight: 120 },
                    { name: 'Стрибки на тумбу', sets: 5, reps: 10 }
                ]
            },
            {
                title: 'Футбол: Тренування техніки',
                type: WorkoutType.FOOTBALL,
                duration_minutes: 60,
                exercises: [
                    { name: 'Дриблінг та удари', duration_seconds: 3600 }
                ]
            },
            {
                title: 'Ранкова Йога',
                type: WorkoutType.YOGA,
                duration_minutes: 20,
                exercises: [
                    { name: 'Привітання сонцю', duration_seconds: 1200 }
                ]
            },
            {
                title: 'Силова: Руки',
                type: WorkoutType.GYM,
                duration_minutes: 55,
                exercises: [
                    { name: 'Молотки', sets: 3, reps: 12, weight: 16 },
                    { name: 'Віджимання вузьким хватом', sets: 3, reps: 15 }
                ]
            },
            {
                title: 'Кардіо: Еліпс',
                type: WorkoutType.GYM,
                duration_minutes: 40,
                exercises: [
                    { name: 'Заняття на еліпсі', distance_km: 6, duration_seconds: 2400 }
                ]
            },
            {
                title: 'Домашній фітнес: Сідниці',
                type: WorkoutType.HOME,
                duration_minutes: 30,
                exercises: [
                    { name: 'Випади', sets: 3, reps: 20 },
                    { name: 'Сідничний місток', sets: 3, reps: 25 }
                ]
            },
            {
                title: 'Тренування на турніках',
                type: WorkoutType.OTHER,
                duration_minutes: 50,
                exercises: [
                    { name: 'Виходи силою', sets: 5, reps: 5 },
                    { name: 'Підтягування широким хватом', sets: 4, reps: 12 }
                ]
            },
            {
                title: 'Вечірній біг: Відновлення',
                type: WorkoutType.CARDIO,
                duration_minutes: 30,
                exercises: [
                    { name: 'Легкий біг', distance_km: 4, duration_seconds: 1800 }
                ]
            },
            {
                title: 'Плавання: Спринт',
                type: WorkoutType.SWIMMING,
                duration_minutes: 40,
                exercises: [
                    { name: 'Спринти 50м', distance_km: 1, duration_seconds: 2400 }
                ]
            },
            {
                title: 'Силова: Максимальні ваги',
                type: WorkoutType.GYM,
                duration_minutes: 90,
                exercises: [
                    { name: 'Жим штанги', sets: 5, reps: 3, weight: 100 },
                    { name: 'Станова тяга', sets: 5, reps: 3, weight: 150 }
                ]
            },
            {
                title: 'Йога перед сном',
                type: WorkoutType.YOGA,
                duration_minutes: 25,
                exercises: [
                    { name: 'Релаксація', duration_seconds: 1500 }
                ]
            },
            {
                title: 'Футбол: Товариський матч',
                type: WorkoutType.FOOTBALL,
                duration_minutes: 120,
                exercises: [
                    { name: 'Гра 11х11', duration_seconds: 7200 }
                ]
            }
        ];

        for (let i = 0; i < workoutsData.length; i++) {
            const data = workoutsData[i];

            // Створюємо дату тренування (від сьогодні і назад у минуле)
            const workoutDate = new Date();
            workoutDate.setDate(workoutDate.getDate() - i);

            const workout = this.workoutRepository.create({
                title: data.title,
                type: data.type,
                duration_minutes: data.duration_minutes,
                notes: data.notes || null,
                workout_date: workoutDate,
                user_id: userId
            });

            const savedWorkout = await this.workoutRepository.save(workout);

            const exercises = data.exercises.map((ex, index) => {
                return this.exerciseRepository.create({
                    name: ex.name,
                    sets: (ex as any).sets,
                    reps: (ex as any).reps,
                    weight: (ex as any).weight,
                    distance_km: (ex as any).distance_km,
                    duration_seconds: (ex as any).duration_seconds,
                    order: index,
                    workout_id: savedWorkout.id
                });
            });

            await this.exerciseRepository.save(exercises);
        }

        return { message: 'Seed for workouts completed successfully' };
    }
}