import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from '../entities/series.entity';
import { SeriesDetails } from '../entities/series-details.entity';
import { SeriesWatched } from '../entities/series-watched.entity';
import { SeriesStatus } from '../enums/series-status.enum';

@Injectable()
export class SeriesSeeder {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
    @InjectRepository(SeriesDetails)
    private readonly detailsRepo: Repository<SeriesDetails>,
    @InjectRepository(SeriesWatched)
    private readonly watchedRepo: Repository<SeriesWatched>,
  ) {}

  async seed(userId: number = 1) {
    const seriesData = [
      {
        tmdb_id: 1399,
        title: 'Гра престолів',
        poster_path: '/u3bZgnocS9SsrTuRn7u5oOjnS96.jpg',
        first_air_date: '2011-04-17',
        status: SeriesStatus.COMPLETED,
        current_season: 8,
        current_episode: 6,
        user_rating: 10,
        user_comment: 'Фінал спірний, але серіал легендарний.',
        details: {
          creator: 'David Benioff, D.B. Weiss',
          number_of_seasons: 8,
          number_of_episodes: 73,
          last_air_date: '2019-05-19',
          cast: [
            {
              name: 'Kit Harington',
              character: 'Jon Snow',
              profile_path: null,
            },
          ],
          production_companies: [{ name: 'HBO', logo_path: null }],
        },
      },
      {
        tmdb_id: 1396,
        title: 'Пуститися берега (Breaking Bad)',
        poster_path: '/gg4m9qnbWRLU9Ki1vPbG7oYn9m.jpg',
        first_air_date: '2008-01-20',
        status: SeriesStatus.COMPLETED,
        current_season: 5,
        current_episode: 16,
        user_rating: 10,
        details: {
          creator: 'Vince Gilligan',
          number_of_seasons: 5,
          number_of_episodes: 62,
          last_air_date: '2013-09-29',
          cast: [
            {
              name: 'Bryan Cranston',
              character: 'Walter White',
              profile_path: null,
            },
          ],
        },
      },
      {
        tmdb_id: 100088,
        title: 'Останні з нас (The Last of Us)',
        poster_path: '/uKvH5j9neYuS82uYjzbBMRmQpOT.jpg',
        first_air_date: '2023-01-15',
        status: SeriesStatus.WATCHING,
        current_season: 1,
        current_episode: 5,
        user_rating: 9,
        details: {
          creator: 'Craig Mazin, Neil Druckmann',
          number_of_seasons: 1,
          number_of_episodes: 9,
          last_air_date: '2023-03-12',
          cast: [
            { name: 'Pedro Pascal', character: 'Joel', profile_path: null },
          ],
        },
      },
      {
        tmdb_id: 66732,
        title: 'Дивні дива (Stranger Things)',
        poster_path: '/x2LSRt2sC8vPGSI6p9pZpC7S6Y9.jpg',
        first_air_date: '2016-07-15',
        status: SeriesStatus.ON_HOLD,
        current_season: 4,
        current_episode: 1,
        details: {
          creator: 'The Duffer Brothers',
          number_of_seasons: 4,
          number_of_episodes: 34,
          last_air_date: '2022-07-01',
        },
      },
      {
        tmdb_id: 71446,
        title: 'Гроші (La Casa de Papel)',
        poster_path: '/reEMJA1Z1vBhYvLcODvPb6Ju0oR.jpg',
        first_air_date: '2017-05-02',
        status: SeriesStatus.COMPLETED,
        current_season: 5,
        current_episode: 10,
        user_rating: 9,
        details: {
          creator: 'Álex Pina',
          number_of_seasons: 5,
          number_of_episodes: 41,
        },
      },
      {
        tmdb_id: 60574,
        title: 'Гострі картузи',
        poster_path: '/p9uiIat4fMivp7OOf28YgYq7K.jpg',
        first_air_date: '2013-09-12',
        status: SeriesStatus.WATCHING,
        current_season: 3,
        current_episode: 4,
        details: {
          creator: 'Steven Knight',
          number_of_seasons: 6,
          number_of_episodes: 36,
        },
      },
      {
        tmdb_id: 60059,
        title: 'Краще подзвоніть Солу',
        poster_path: '/fC2S3AnUvky9p6kqS7_1vP8W.jpg',
        first_air_date: '2015-02-08',
        status: SeriesStatus.WATCH_LATER,
        details: {
          creator: 'Vince Gilligan',
          number_of_seasons: 6,
          number_of_episodes: 63,
        },
      },
      {
        tmdb_id: 42009,
        title: 'Чорне дзеркало',
        poster_path: '/7X6yE7P9U9R.jpg',
        first_air_date: '2011-12-04',
        status: SeriesStatus.WATCHING,
        current_season: 6,
        current_episode: 2,
        details: {
          creator: 'Charlie Brooker',
          number_of_seasons: 6,
          number_of_episodes: 27,
        },
      },
      {
        tmdb_id: 67744,
        title: 'Мандалорець',
        poster_path: '/999zz.jpg',
        first_air_date: '2019-11-12',
        status: SeriesStatus.COMPLETED,
        current_season: 3,
        current_episode: 8,
        user_rating: 8,
        details: {
          creator: 'Jon Favreau',
          number_of_seasons: 3,
          number_of_episodes: 24,
        },
      },
      {
        tmdb_id: 1412,
        title: 'Стріла',
        poster_path: '/arrow.jpg',
        first_air_date: '2012-10-10',
        status: SeriesStatus.DROPPED,
        current_season: 4,
        current_episode: 12,
        user_comment: 'Стало нудно після 3 сезону.',
        details: { number_of_seasons: 8, number_of_episodes: 170 },
      },
      {
        tmdb_id: 62560,
        title: 'Містер Робот',
        poster_path: '/robot.jpg',
        first_air_date: '2015-06-24',
        status: SeriesStatus.COMPLETED,
        current_season: 4,
        current_episode: 13,
        user_rating: 10,
        details: {
          creator: 'Sam Esmail',
          number_of_seasons: 4,
          number_of_episodes: 45,
        },
      },
      {
        tmdb_id: 76479,
        title: 'Хлопаки (The Boys)',
        poster_path: '/boys.jpg',
        first_air_date: '2019-07-26',
        status: SeriesStatus.WATCHING,
        current_season: 4,
        current_episode: 8,
        user_rating: 9,
        details: {
          creator: 'Eric Kripke',
          number_of_seasons: 4,
          number_of_episodes: 32,
        },
      },
      {
        tmdb_id: 85271,
        title: 'ВандаВіжен',
        poster_path: '/wanda.jpg',
        first_air_date: '2021-01-15',
        status: SeriesStatus.COMPLETED,
        current_season: 1,
        current_episode: 9,
        details: {
          creator: 'Jac Schaeffer',
          number_of_seasons: 1,
          number_of_episodes: 9,
        },
      },
      {
        tmdb_id: 1402,
        title: 'Ходячі мерці',
        poster_path: '/walking.jpg',
        first_air_date: '2010-10-31',
        status: SeriesStatus.ON_HOLD,
        current_season: 9,
        current_episode: 1,
        details: { number_of_seasons: 11, number_of_episodes: 177 },
      },
      {
        tmdb_id: 82856,
        title: 'Маньяк',
        poster_path: '/maniac.jpg',
        first_air_date: '2018-09-21',
        status: SeriesStatus.COMPLETED,
        current_season: 1,
        current_episode: 10,
        details: { number_of_seasons: 1, number_of_episodes: 10 },
      },
      {
        tmdb_id: 63174,
        title: 'Люцифер',
        poster_path: '/luci.jpg',
        first_air_date: '2016-01-25',
        status: SeriesStatus.COMPLETED,
        current_season: 6,
        current_episode: 10,
        details: { number_of_seasons: 6, number_of_episodes: 93 },
      },
      {
        tmdb_id: 71912,
        title: 'Відьмак',
        poster_path: '/witcher.jpg',
        first_air_date: '2019-12-20',
        status: SeriesStatus.WATCHING,
        current_season: 3,
        current_episode: 1,
        details: {
          creator: 'Lauren Schmidt Hissrich',
          number_of_seasons: 3,
          number_of_episodes: 24,
        },
      },
      {
        tmdb_id: 93405,
        title: 'Гра в кальмара',
        poster_path: '/squid.jpg',
        first_air_date: '2021-09-17',
        status: SeriesStatus.COMPLETED,
        current_season: 1,
        current_episode: 9,
        user_rating: 8,
        details: { number_of_seasons: 1, number_of_episodes: 9 },
      },
      {
        tmdb_id: 1406,
        title: 'Шерлок',
        poster_path: '/sherlock.jpg',
        first_air_date: '2010-07-25',
        status: SeriesStatus.COMPLETED,
        current_season: 4,
        current_episode: 3,
        user_rating: 10,
        details: {
          creator: 'Steven Moffat, Mark Gatiss',
          number_of_seasons: 4,
          number_of_episodes: 12,
        },
      },
      {
        tmdb_id: 1434,
        title: 'Сім’янин',
        poster_path: '/family.jpg',
        first_air_date: '1999-01-31',
        status: SeriesStatus.WATCHING,
        current_season: 22,
        current_episode: 10,
        details: { number_of_seasons: 22, number_of_episodes: 424 },
      },
      {
        tmdb_id: 456,
        title: 'Сімпсони',
        poster_path: '/simpsons.jpg',
        first_air_date: '1989-12-17',
        status: SeriesStatus.WATCHING,
        current_season: 35,
        current_episode: 5,
        details: { number_of_seasons: 35, number_of_episodes: 750 },
      },
      {
        tmdb_id: 60625,
        title: 'Рік та Морті',
        poster_path: '/rick.jpg',
        first_air_date: '2013-12-02',
        status: SeriesStatus.WATCHING,
        current_season: 7,
        current_episode: 10,
        user_rating: 10,
        details: {
          creator: 'Dan Harmon, Justin Roiland',
          number_of_seasons: 7,
          number_of_episodes: 71,
        },
      },
      {
        tmdb_id: 2316,
        title: 'Офіс',
        poster_path: '/office.jpg',
        first_air_date: '2005-03-24',
        status: SeriesStatus.COMPLETED,
        current_season: 9,
        current_episode: 23,
        user_rating: 9,
        details: { number_of_seasons: 9, number_of_episodes: 201 },
      },
      {
        tmdb_id: 1418,
        title: 'Теорія великого вибуху',
        poster_path: '/tbbt.jpg',
        first_air_date: '2007-09-24',
        status: SeriesStatus.COMPLETED,
        current_season: 12,
        current_episode: 24,
        details: { number_of_seasons: 12, number_of_episodes: 279 },
      },
      {
        tmdb_id: 4614,
        title: 'NCIS: Полювання на вбивць',
        poster_path: '/ncis.jpg',
        first_air_date: '2003-09-23',
        status: SeriesStatus.WATCH_LATER,
        details: { number_of_seasons: 21, number_of_episodes: 460 },
      },
    ];

    for (const data of seriesData) {
      let details = await this.detailsRepo.findOne({
        where: { tmdb_id: data.tmdb_id },
      });
      if (!details) {
        details = this.detailsRepo.create({
          tmdb_id: data.tmdb_id,
          ...data.details,
        });
        await this.detailsRepo.save(details);
      }

      const seriesExists = await this.seriesRepo.findOne({
        where: { tmdb_id: data.tmdb_id },
      });
      if (!seriesExists) {
        const series = this.seriesRepo.create({
          tmdb_id: data.tmdb_id,
          title: data.title,
          poster_path: data.poster_path,
          first_air_date: data.first_air_date,
          details: details,
        });
        await this.seriesRepo.save(series);
      }

      const watchedExists = await this.watchedRepo.findOne({
        where: { tmdb_id: data.tmdb_id, user_id: userId },
      });
      if (!watchedExists) {
        const watched = this.watchedRepo.create({
          user_id: userId,
          tmdb_id: data.tmdb_id,
          status: data.status,
          current_season: data.current_season,
          current_episode: data.current_episode,
          user_rating: data.user_rating,
        });
        await this.watchedRepo.save(watched);
      }
    }
    return { message: 'Seed for series completed successfully' };
  }
}
