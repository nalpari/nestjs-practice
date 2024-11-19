import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { DirectorModule } from './director/director.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [MovieModule, DirectorModule, GenreModule],
})
export class AppModule {}
