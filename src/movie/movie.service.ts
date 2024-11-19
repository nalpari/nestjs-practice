import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private movieRepository: Repository<Movie>,
    @Inject('MOVIE_DETAIL_REPOSITORY')
    private movieDetailRepository: Repository<MovieDetail>,
    @Inject('DIRECTOR_REPOSITORY')
    private directorRepository: Repository<Director>,
    @Inject('GENRE_REPOSITORY')
    private genreRepository: Repository<Genre>,
  ) {}

  /**
   * 모든 영화 조회
   * @returns {Promise<Movie[]>} 모든 영화
   */
  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['detail', 'director', 'genres'],
    });
  }

  /**
   * 영화 단일 조회
   * @param {number} id - 영화 id
   * @returns {Promise<Movie>} 영화
   */
  async findOne(id: number): Promise<Movie> {
    return await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });
  }

  /**
   * 영화 생성
   * @param {CreateMovieDto} movie - 영화 생성 정보
   * @returns {Promise<Movie>} 생성된 영화
   */
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

    const genres = await this.genreRepository.find({
      where: {
        id: In(movie.genreIds),
      },
    });

    if (genres.length !== movie.genreIds.length) {
      throw new NotFoundException('존재하지 않는 장르가 있습니다.');
    }

    return await this.movieRepository.save({
      title: movie.title,
      genres,
      detail: {
        detail: movie.detail,
      },
      director,
    });
  }

  /**
   * 영화 수정
   * @param {number} id - 영화 id
   * @param {UpdateMovieDto} movie - 영화 수정 정보
   * @returns {Promise<Movie>} 수정된 영화
   */
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
      relations: ['detail', 'director', 'genres'],
    });
  }

  /**
   * 영화 삭제
   * @param {number} id - 영화 id
   * @returns {Promise<DeleteResult>} 삭제된 영화
   */
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
