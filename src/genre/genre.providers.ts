import { DataSource } from 'typeorm';
import { Genre } from './entity/genre.entity';

export const genreProviders = [
  {
    provide: 'GENRE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Genre),
    inject: ['DATA_SOURCE'],
  },
];
