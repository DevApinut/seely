import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuggestDto } from './dto/create-suggest.dto';
import { UpdateSuggestDto } from './dto/update-suggest.dto';
import { Repository } from 'typeorm';
import { Suggest } from './entities/suggest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Series } from '@app/series/entities/series.entity';

@Injectable()
export class SuggestService {
  constructor(
    @InjectRepository(Suggest)
    private readonly repository: Repository<Suggest>,
    @InjectRepository(Series)
    private readonly repositorySerie: Repository<Series>,
  ) {}

  async create(createSuggestDto: CreateSuggestDto, loggedInDto: LoggedInDto) {
    try {
      //
      //  find data on own table series
      //
      const ownSeries = await this.repositorySerie.findOne({
        where: {
          id: createSuggestDto.series_id,
          user: { username: loggedInDto.username },
        },
      });

      if (ownSeries) {
        throw new NotFoundException(
          `You are not allowed to rate your own series`,
        );
      }

      const series = await this.repositorySerie.findOneOrFail({
        where: { id: createSuggestDto.series_id },
      });
      if (series) {
        // Check if user already suggested this series
        const existingSuggest = await this.repository.findOne({
          where: {
            series_id: createSuggestDto.series_id,
            user: { username: loggedInDto.username },
          },
        });

        if (existingSuggest) {
          // Update existing suggest
          return await this.repository.save({
            id: existingSuggest.id,
            ...createSuggestDto,
            user: { username: loggedInDto.username },
          });
        } else {
          // Create new suggest
          return await this.repository.save({
            ...createSuggestDto,
            user: { username: loggedInDto.username },
          });
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Series not found`);
    }
  }

 

  update(
    id: number,
    updateSuggestDto: UpdateSuggestDto,
    loggedInDto: LoggedInDto,
  ) {
    return this.repository
      .findOneByOrFail({
        series_id: id,
        user: { username: loggedInDto.username },
      })
      .then((res) =>
        this.repository.save({
          id: res.id,
          ...updateSuggestDto,
          username: loggedInDto.username,
        }),
      )
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }

  async remove(id: number, loggedInDto: LoggedInDto) {
    try {
      const res = await this.repository.findOneByOrFail({
        series_id: id,
        user: { username: loggedInDto.username },
      });
      await this.repository.delete({ id: res.id });
      return 'delete success';
    } catch (error) {
      throw new NotFoundException(`Not found: id=${id}`);
    }
  }
}
