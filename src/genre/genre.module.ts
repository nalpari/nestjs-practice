import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { DatabaseModule } from 'src/database/database.module';
import { genreProviders } from './genre.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [GenreController],
  providers: [...genreProviders, GenreService],
})
export class GenreModule {}
