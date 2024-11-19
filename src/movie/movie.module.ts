import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { movieProviders } from './movie.providers';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { directorProviders } from 'src/director/director.providers';
import { genreProviders } from 'src/genre/genre.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    MovieService,
    ...movieProviders,
    ...directorProviders,
    ...genreProviders,
  ],
  controllers: [MovieController],
})
export class MovieModule {}
