import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { movieProviders } from './movie.providers';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...movieProviders, MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
