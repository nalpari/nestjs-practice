import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private movieRepository: Repository<Movie>,
    @Inject('MOVIE_DETAIL_REPOSITORY')
    private movieDetailRepository: Repository<MovieDetail>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['detail'],
    });
  }

  async findOne(id: number): Promise<Movie> {
    return await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });
  }

  async create(movie: CreateMovieDto): Promise<Movie> {
    // const detail = await this.movieDetailRepository.save({
    //   detail: movie.detail,
    // });

    return await this.movieRepository.save({
      title: movie.title,
      genre: movie.genre,
      detail: {
        detail: movie.detail,
      },
    });
  }

  async update(id: number, movie: UpdateMovieDto): Promise<Movie> {
    const selectMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail'],
    });

    if (!selectMovie) {
      throw new NotFoundException('영화가 존재하지 않습니다.');
    }

    const { detail, ...movieRest } = movie;

    await this.movieRepository.update(id, movieRest);

    if (detail) {
      await this.movieDetailRepository.update(selectMovie.detail.id, {
        detail,
      });
    }

    return await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail'],
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    const selectMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!selectMovie) {
      throw new NotFoundException('영화가 존재하지 않습니다.');
    }

    return await this.movieRepository.delete(id);
  }
}
