import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { DatabaseModule } from 'src/database/database.module';
import { directorProviders } from './director.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [DirectorController],
  providers: [...directorProviders, DirectorService],
})
export class DirectorModule {}
