import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { movieProviders } from './movie.providers';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { directorProviders } from 'src/director/director.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...movieProviders, MovieService, ...directorProviders],
  controllers: [MovieController],
})
export class MovieModule {}
