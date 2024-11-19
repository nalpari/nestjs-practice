import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Director } from 'src/director/entity/director.entity';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private movieRepository: Repository<Movie>,
    @Inject('MOVIE_DETAIL_REPOSITORY')
    private movieDetailRepository: Repository<MovieDetail>,
    @Inject('DIRECTOR_REPOSITORY')
    private directorRepository: Repository<Director>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['detail', 'director'],
    });
  }

  async findOne(id: number): Promise<Movie> {
    return await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director'],
    });
  }

  async create(movie: CreateMovieDto): Promise<Movie> {
    // const detail = await this.movieDetailRepository.save({
    //   detail: movie.detail,
    // });

    const director = await this.directorRepository.findOne({
      where: {
        id: movie.directorId,
      },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 감독입니다.');
    }

    return await this.movieRepository.save({
      title: movie.title,
      genre: movie.genre,
      detail: {
        detail: movie.detail,
      },
      director,
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

    const { detail, directorId, ...movieRest } = movie;

    let newDirector;
    // director 체크
    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId,
        },
      });

      if (!director) {
        throw new NotFoundException('존재하지 않는 감독입니다.');
      }

      newDirector = director;
    }

    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
    };

    await this.movieRepository.update(id, movieUpdateFields);

    if (detail) {
      await this.movieDetailRepository.update(selectMovie.detail.id, {
        detail,
      });
    }

    return await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director'],
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
