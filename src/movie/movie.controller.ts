import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() movie: CreateMovieDto) {
    return this.movieService.create(movie);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() movie: UpdateMovieDto) {
    return this.movieService.update(id, movie);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.movieService.delete(id);
  }
}
