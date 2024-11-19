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

  async create(createGenreDto: CreateGenreDto) {
    return await this.genreRepository.save(createGenreDto);
  }

  async findAll() {
    return await this.genreRepository.find();
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundException('장르가 존재하지 않습니다.');
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);

    if (!genre) {
      throw new NotFoundException('장르가 존재하지 않습니다.');
    }

    await this.genreRepository.update(id, updateGenreDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);

    if (!genre) {
      throw new NotFoundException('장르가 존재하지 않습니다.');
    }

    await this.genreRepository.delete(id);

    return id;
  }
}
