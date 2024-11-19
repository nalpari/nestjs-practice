import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Repository } from 'typeorm';
import { Genre } from './entity/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @Inject('GENRE_REPOSITORY')
    private genreRepository: Repository<Genre>,
  ) {}

  /**
   * 장르 생성
   * @param {CreateGenreDto} createGenreDto - 장르 생성 정보
   * @returns {Promise<Genre>} 생성된 장르
   */
  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    return await this.genreRepository.save(createGenreDto);
  }

  /**
   * 모든 장르 조회
   * @returns {Promise<Genre[]>} 모든 장르
   */
  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  /**
   * 장르 단일 조회
   * @param {number} id - 장르 id
   * @returns {Promise<Genre>} 장르
   */
  async findOne(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundException('장르가 존재하지 않습니다.');
    }

    return genre;
  }

  /**
   * 장르 수정
   * @param {number} id - 장르 id
   * @param {UpdateGenreDto} updateGenreDto - 장르 수정 정보
   * @returns {Promise<Genre>} 수정된 장르
   */
  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);

    if (!genre) {
      throw new NotFoundException('장르가 존재하지 않습니다.');
    }

    await this.genreRepository.update(id, updateGenreDto);

    return await this.findOne(id);
  }

  /**
   * 장르 삭제
   * @param {number} id - 장르 id
   * @returns {Promise<number>} 삭제된 장르 id
   */
  async remove(id: number): Promise<number> {
    const genre = await this.findOne(id);

    if (!genre) {
      throw new NotFoundException('장르가 존재하지 않습니다.');
    }

    await this.genreRepository.delete(id);

    return id;
  }
}
