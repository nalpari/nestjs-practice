import { DataSource } from 'typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';

export const movieProviders = [
  {
    provide: 'MOVIE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Movie),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MOVIE_DETAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MovieDetail),
    inject: ['DATA_SOURCE'],
  },
];
