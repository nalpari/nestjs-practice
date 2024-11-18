import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Repository } from 'typeorm';
import { Director } from './entity/director.entity';

@Injectable()
export class DirectorService {
  constructor(
    @Inject('DIRECTOR_REPOSITORY')
    private directorRepository: Repository<Director>,
  ) {}

  async create(createDirectorDto: CreateDirectorDto) {
    return await this.directorRepository.save(createDirectorDto);
  }

  async findAll() {
    return await this.directorRepository.find();
  }

  async findOne(id: number) {
    return await this.directorRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const director = await this.directorRepository.findOne({
      where: {
        id,
      },
    });

    if (!director) {
      throw new NotFoundException('감독이 존재하지 않습니다.');
    }

    await this.directorRepository.update(id, updateDirectorDto);

    return this.directorRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const director = await this.directorRepository.findOne({
      where: {
        id,
      },
    });

    if (!director) {
      throw new NotFoundException('감독이 존재하지 않습니다.');
    }

    return await this.directorRepository.delete(id);
  }
}
