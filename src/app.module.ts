import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { DirectorModule } from './director/director.module';

@Module({
  imports: [MovieModule, DirectorModule],
})
export class AppModule {}
