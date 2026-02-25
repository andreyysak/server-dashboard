import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { MovieDetails } from '../entities/movie-details.entity';
import { MovieWatchedEntity } from '../entities/movie-watched.entity';
import { MovieWatchLater } from '../entities/movie_watch_later.entity';

export enum SeederMovieStatus {
  WATCHED = 'watched',
  WATCH_LATER = 'watch_later',
}

@Injectable()
export class MoviesSeeder {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(MovieDetails)
    private readonly detailsRepo: Repository<MovieDetails>,
    @InjectRepository(MovieWatchedEntity)
    private readonly watchedRepo: Repository<MovieWatchedEntity>,
    @InjectRepository(MovieWatchLater)
    private readonly laterRepo: Repository<MovieWatchLater>,
  ) {}

  async seed(userId: number = 1) {
    const moviesData = [
      {
        tmdb_id: 27205,
        title: 'Початок (Inception)',
        poster_path: '/edv5CZvfkjSB9vBYZrotpY9e0oR.jpg',
        release_date: '2010-07-15',
        overview:
          'Кобб — талановитий злодій, кращий у мистецтві витягування секретів.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Christopher Nolan',
          budget: 160000000,
          revenue: 825532764,
          runtime: 148,
          cast: [
            {
              name: 'Leonardo DiCaprio',
              character: 'Cobb',
              profile_path: null,
            },
            {
              name: 'Cillian Murphy',
              character: 'Robert Fischer',
              profile_path: null,
            },
          ],
          production_companies: [
            { name: 'Warner Bros. Pictures', logo_path: null },
          ],
        },
      },
      {
        tmdb_id: 157336,
        title: 'Інтерстеллар',
        poster_path: '/gEU2QniE6E77NI6lCU6MxlSwwIx.jpg',
        release_date: '2014-11-05',
        overview:
          'Команда дослідників вирушає у подорож за межі нашої галактики.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Christopher Nolan',
          budget: 165000000,
          revenue: 675120017,
          runtime: 169,
          cast: [
            {
              name: 'Matthew McConaughey',
              character: 'Cooper',
              profile_path: null,
            },
          ],
          production_companies: [{ name: 'Paramount', logo_path: null }],
        },
      },
      {
        tmdb_id: 603,
        title: 'Матриця',
        poster_path: '/dXNAPwY7Vrq7oWsnDE0EXH088XU.jpg',
        release_date: '1999-03-30',
        overview:
          'Нео дізнається, що світ навколо нього — це комп’ютерна симуляція.',
        status: SeederMovieStatus.WATCH_LATER,
        details: {
          director: 'Lana Wachowski',
          budget: 63000000,
          revenue: 463517383,
          runtime: 136,
          cast: [
            { name: 'Keanu Reeves', character: 'Neo', profile_path: null },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 550,
        title: 'Бійцівський клуб',
        poster_path: '/pB8uS6Sls9fTCiFW9U9Ws9Ym05B.jpg',
        release_date: '1999-10-15',
        overview: 'Співробітник страхової компанії шукає вихід з рутини.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'David Fincher',
          budget: 63000000,
          revenue: 100853753,
          runtime: 139,
          cast: [
            {
              name: 'Brad Pitt',
              character: 'Tyler Durden',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 155,
        title: 'Темний лицар',
        poster_path: '/qJ2tW6WMUDp9QmSbmM94STdhvqy.jpg',
        release_date: '2008-07-16',
        overview: 'Бетмен протистоїть хаосу, який несе Джокер.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Christopher Nolan',
          budget: 185000000,
          revenue: 1004558444,
          runtime: 152,
          cast: [
            { name: 'Heath Ledger', character: 'Joker', profile_path: null },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 680,
        title: 'Кримінальне чтиво',
        poster_path: '/fIE3JCY0uSCDu0zEkqSO8Jm6T6f.jpg',
        release_date: '1994-09-10',
        overview: 'Життя двох бандитів переплітається в дивній історії.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Quentin Tarantino',
          budget: 8000000,
          revenue: 213928762,
          runtime: 154,
          cast: [
            {
              name: 'John Travolta',
              character: 'Vincent Vega',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 13,
        title: 'Форрест Гамп',
        poster_path: '/arS86V7UqisYv29S97N499K7oB2.jpg',
        release_date: '1994-07-06',
        overview:
          'Історія про чоловіка з добрим серцем, який опинився в центрі історичних подій.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Robert Zemeckis',
          budget: 55000000,
          revenue: 677387716,
          runtime: 142,
          cast: [
            {
              name: 'Tom Hanks',
              character: 'Forrest Gump',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 238,
        title: 'Хрещений батько',
        poster_path: '/3bhkrjYEMerobS9Y7AddB7J97S8.jpg',
        release_date: '1972-03-14',
        overview: 'Епічна сага про кримінальну родину Корлеоне.',
        status: SeederMovieStatus.WATCH_LATER,
        details: {
          director: 'Francis Ford Coppola',
          budget: 6000000,
          revenue: 245066411,
          runtime: 175,
          cast: [
            {
              name: 'Marlon Brando',
              character: 'Vito Corleone',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 122,
        title: 'Володар перснів: Повернення короля',
        poster_path: '/rCzpDbtYv8p80v9XWpXIBU1s9S7.jpg',
        release_date: '2003-12-01',
        overview: 'Фінальна битва за Середзем’я.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Peter Jackson',
          budget: 94000000,
          revenue: 1118888979,
          runtime: 201,
          cast: [
            { name: 'Elijah Wood', character: 'Frodo', profile_path: null },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 497,
        title: 'Зелена миля',
        poster_path: '/velWp72uSxaUR7icVMsg1nsRGAR.jpg',
        release_date: '1999-12-10',
        overview: 'Надприродні події у в’язниці для смертників.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Frank Darabont',
          budget: 60000000,
          revenue: 286701684,
          runtime: 189,
          cast: [
            {
              name: 'Michael Clarke Duncan',
              character: 'John Coffey',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 299536,
        title: 'Месники: Війна нескінченності',
        poster_path: '/7WsyChvgywgypL7U70mS0TnsNMC.jpg',
        release_date: '2018-04-25',
        overview: 'Месники намагаються зупинити Таноса.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Anthony Russo',
          budget: 300000000,
          revenue: 2046239637,
          runtime: 149,
          cast: [
            {
              name: 'Robert Downey Jr.',
              character: 'Iron Man',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 11,
        title: 'Зоряні війни: Нова надія',
        poster_path: '/6FfTJu80mS4P6pB9YZZ1oKj9A3.jpg',
        release_date: '1977-05-25',
        overview: 'Люк Скайвокер приєднується до повстання проти Імперії.',
        status: SeederMovieStatus.WATCH_LATER,
        details: {
          director: 'George Lucas',
          budget: 11000000,
          revenue: 775398007,
          runtime: 121,
          cast: [
            {
              name: 'Mark Hamill',
              character: 'Luke Skywalker',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 105,
        title: 'Назад у майбутнє',
        poster_path: '/7lyBebUnS7n7v9uS0pM39Ym0oR.jpg',
        release_date: '1985-07-03',
        overview: 'Марті Макфлай випадково потрапляє у 1955 рік.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Robert Zemeckis',
          budget: 19000000,
          revenue: 381109762,
          runtime: 116,
          cast: [
            {
              name: 'Michael J. Fox',
              character: 'Marty McFly',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 424,
        title: 'Список Шиндлера',
        poster_path: '/sF1U4EU7SZ4An32LcMRmsJEqA9a.jpg',
        release_date: '1993-11-30',
        overview: 'Німецький бізнесмен рятує євреїв під час Голокосту.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Steven Spielberg',
          budget: 22000000,
          revenue: 321365567,
          runtime: 195,
          cast: [
            {
              name: 'Liam Neeson',
              character: 'Oskar Schindler',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 311,
        title: 'Престиж',
        poster_path: '/bdN3mYvC9ovpU6p9f9f9f9f9f9.jpg',
        release_date: '2006-10-19',
        overview: 'Двоє ілюзіоністів змагаються за секрет найкращого трюку.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Christopher Nolan',
          budget: 40000000,
          revenue: 109676311,
          runtime: 130,
          cast: [
            {
              name: 'Hugh Jackman',
              character: 'Robert Angier',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 157,
        title: 'Зоряні війни: Імперія завдає удару у відповідь',
        poster_path: '/7m3pB9yZ9z9z9z9z9z9z9z9z.jpg',
        release_date: '1980-05-21',
        overview: 'Імперія продовжує полювання на повстанців.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Irvin Kershner',
          budget: 18000000,
          revenue: 538400000,
          runtime: 124,
          cast: [
            {
              name: 'Harrison Ford',
              character: 'Han Solo',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 278,
        title: 'Втеча з Шоушенка',
        poster_path: '/lyp4l9kzR7MvE8H6SSc2vOCz86m.jpg',
        release_date: '1994-09-23',
        overview: 'Енді Дюфрейн намагається вижити у в’язниці Шоушенк.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Frank Darabont',
          budget: 25000000,
          revenue: 28341469,
          runtime: 142,
          cast: [
            { name: 'Morgan Freeman', character: 'Red', profile_path: null },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 807,
        title: 'Сім',
        poster_path: '/69Yv9v9v9v9v9v9v9v9v9v.jpg',
        release_date: '1995-09-22',
        overview:
          'Детективи шукають вбивцю, що використовує сім смертних гріхів.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'David Fincher',
          budget: 33000000,
          revenue: 327311859,
          runtime: 127,
          cast: [{ name: 'Brad Pitt', character: 'Mills', profile_path: null }],
          production_companies: [],
        },
      },
      {
        tmdb_id: 110,
        title: 'Леон',
        poster_path: '/7ly7y7y7y7y7y7y7y7y7.jpg',
        release_date: '1994-09-14',
        overview: 'Кілер Леон бере під опіку дівчинку Матильду.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Luc Besson',
          budget: 16000000,
          revenue: 46100000,
          runtime: 110,
          cast: [{ name: 'Jean Reno', character: 'Leon', profile_path: null }],
          production_companies: [],
        },
      },
      {
        tmdb_id: 120,
        title: 'Володар перснів: Хранителі персня',
        poster_path: '/66666666666666666666.jpg',
        release_date: '2001-12-18',
        overview: 'Початок подорожі Фродо до Мордору.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Peter Jackson',
          budget: 93000000,
          revenue: 871368364,
          runtime: 178,
          cast: [
            { name: 'Ian McKellen', character: 'Gandalf', profile_path: null },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 121,
        title: 'Володар перснів: Дві вежі',
        poster_path: '/55555555555555555555.jpg',
        release_date: '2002-12-18',
        overview: 'Подорож триває, битва за Гельмову Западину наближається.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Peter Jackson',
          budget: 94000000,
          revenue: 926047194,
          runtime: 179,
          cast: [
            {
              name: 'Viggo Mortensen',
              character: 'Aragorn',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 240,
        title: 'Хрещений батько 2',
        poster_path: '/4444444444444444444.jpg',
        release_date: '1974-12-20',
        overview: 'Продовження історії родини Корлеоне.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Francis Ford Coppola',
          budget: 13000000,
          revenue: 102600000,
          runtime: 202,
          cast: [
            {
              name: 'Al Pacino',
              character: 'Michael Corleone',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 1573,
        title: 'Шосте чуття',
        poster_path: '/3333333333333333333.jpg',
        release_date: '1999-08-06',
        overview: 'Хлопчик бачить мертвих людей.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'M. Night Shyamalan',
          budget: 40000000,
          revenue: 672806292,
          runtime: 107,
          cast: [
            {
              name: 'Bruce Willis',
              character: 'Malcolm Crowe',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 274,
        title: 'Мовчання ягнят',
        poster_path: '/2222222222222222222.jpg',
        release_date: '1991-01-30',
        overview: 'Агент ФБР просить допомоги у Ганнібала Лектера.',
        status: SeederMovieStatus.WATCHED,
        details: {
          director: 'Jonathan Demme',
          budget: 19000000,
          revenue: 272742922,
          runtime: 118,
          cast: [
            {
              name: 'Anthony Hopkins',
              character: 'Hannibal Lecter',
              profile_path: null,
            },
          ],
          production_companies: [],
        },
      },
      {
        tmdb_id: 1891,
        title: 'Імперія сонця',
        poster_path: '/111111111111111111.jpg',
        release_date: '1987-12-09',
        overview:
          'Хлопчик намагається вижити в японському таборі під час війни.',
        status: SeederMovieStatus.WATCH_LATER,
        details: {
          director: 'Steven Spielberg',
          budget: 35000000,
          revenue: 22238696,
          runtime: 153,
          cast: [
            { name: 'Christian Bale', character: 'Jim', profile_path: null },
          ],
          production_companies: [],
        },
      },
    ];

    for (const data of moviesData) {
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

      const movieExists = await this.movieRepo.findOne({
        where: { tmdb_id: data.tmdb_id },
      });

      if (!movieExists) {
        const movie = this.movieRepo.create({
          tmdb_id: data.tmdb_id,
          title: data.title,
          poster_path: data.poster_path,
          release_date: data.release_date,
          overview: data.overview,
          details: details,
        });
        await this.movieRepo.save(movie);
      }

      if (data.status === SeederMovieStatus.WATCHED) {
        const alreadyWatched = await this.watchedRepo.findOne({
          where: { tmdb_id: data.tmdb_id, user_id: userId },
        });

        if (!alreadyWatched) {
          const record = this.watchedRepo.create({
            tmdb_id: data.tmdb_id,
            user_id: userId,
          });
          await this.watchedRepo.save(record);
        }
      } else if (data.status === SeederMovieStatus.WATCH_LATER) {
        const alreadyLater = await this.laterRepo.findOne({
          where: { tmdb_id: data.tmdb_id, user_id: userId },
        });

        if (!alreadyLater) {
          const record = this.laterRepo.create({
            tmdb_id: data.tmdb_id,
            user_id: userId,
          });
          await this.laterRepo.save(record);
        }
      }
    }

    return { message: 'Seed for movies completed successfully' };
  }
}
