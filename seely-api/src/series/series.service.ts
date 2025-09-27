import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';

export const paginateConfig: PaginateConfig<Series> = {
  sortableColumns: ['id', 'name'],
  searchableColumns: ['name', 'name', 'year'],
  defaultLimit: 10,
  maxLimit: 100,
};

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly repository: Repository<Series>,
  ) {}

  private queryTemplate(loggedInDto?: LoggedInDto) {
    const query = this.repository
      .createQueryBuilder('series')
      .leftJoinAndSelect('series.rating', 'rating')
      .leftJoin('series.user', 'seriesUser')
      .addSelect('seriesUser.username');

    if (loggedInDto) {
      query
        .leftJoin(
          'series.suggests',
          'suggests',
          'suggests.series_id = series.id AND suggests.username = :username',
          { username: loggedInDto.username },
        )
        .addSelect(['suggests.series_id', 'suggests.score'])
        .leftJoin('suggests.user', 'suggestUser')
        .addSelect(['suggestUser.username', 'suggestUser.role']);
    } else {
      // For non-logged users, still load suggests structure but empty
      query
        .leftJoin('series.suggests', 'suggests', '1=0') 
        .addSelect(['suggests.series_id', 'suggests.score'])
        .leftJoin('suggests.user', 'suggestUser', '1=0')
        .addSelect(['suggestUser.username', 'suggestUser.role']);
    }
    
    return query;
  }

  // Add new method to get stats
  private async getSeriesStats(seriesId: number) {
    const result = await this.repository
      .createQueryBuilder('series')
      .leftJoin('series.suggests', 'suggests')
      .select('COUNT(suggests.id)', 'totalSuggests')
      .addSelect('COALESCE(AVG(suggests.score), 0)', 'averageScore')
      .where('series.id = :seriesId', { seriesId })
      .getRawOne();

    return {
      totalSuggests: parseInt(result.totalSuggests) || 0,
      averageScore: parseFloat(parseFloat(result.averageScore).toFixed(2)) || 0,
    };
  }

  // Create query for user's own series only
  private async mySeriesQuery(loggedInDto: LoggedInDto) {
    return await this.repository
      .createQueryBuilder('series')
      .leftJoinAndSelect('series.rating', 'rating')
      .leftJoin('series.user', 'seriesUser')
      .addSelect('seriesUser.username')
      .leftJoin(
        'series.suggests',
        'suggests',
        'suggests.series_id = series.id AND suggests.username = :username',
        { username: loggedInDto.username },
      )
      .addSelect(['suggests.series_id', 'suggests.score'])
      .leftJoin('suggests.user', 'suggestUser')
      .addSelect(['suggestUser.username', 'suggestUser.role'])
      .where('seriesUser.username = :username', {
        username: loggedInDto.username,
      });
  }

  create(createSeriesDto: CreateSeriesDto, loggedInDto: LoggedInDto) {
    return this.repository.save({
      ...createSeriesDto,
      user: { username: loggedInDto.username },
    });
  }

  async search(query: PaginateQuery, loggedInDto?: LoggedInDto) {
    const page = await paginate<Series>(
      query,
      this.queryTemplate(loggedInDto),
      paginateConfig,
    );

    const dataWithStats = await Promise.all(
      page.data.map(async (series) => {
        const stats = await this.getSeriesStats(series.id);
        return {
          ...series,
          totalSuggests: stats.totalSuggests,
          averageScore: stats.averageScore,
        };
      }),
    );

    return {
      data: dataWithStats,
      meta: page.meta,
    };
  }

  async Myseries(query: PaginateQuery, loggedInDto?: LoggedInDto) {
    if (!loggedInDto) {
      return {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      };
    }

    const page = await paginate<Series>(query, await this.mySeriesQuery(loggedInDto), paginateConfig);

    const dataWithStats = await Promise.all(
      page.data.map(async (series) => {
        const stats = await this.getSeriesStats(series.id);
        return {
          ...series,
          totalSuggests: stats.totalSuggests,
          averageScore: stats.averageScore,
        };
      }),
    );

    return {
      data: dataWithStats,
      meta: page.meta,
    };
  }

  async findOne(id: number, loggedInDto?: LoggedInDto) {
    const series = await this.queryTemplate(loggedInDto)
      .where('series.id = :id', { id })
      .getOne();

    if (series) {
      const stats = await this.getSeriesStats(series.id);
      return {
        ...series,
        totalSuggests: stats.totalSuggests,
        averageScore: stats.averageScore,
      };
    }

    return series;
  }

  async update(
    id: number,
    updateSeriesDto: UpdateSeriesDto,
    loggedInDto: LoggedInDto,
  ) {
    try {
      const series = await this.repository.findOneByOrFail({ 
        id, 
        user: { username: loggedInDto.username } 
      });
      return await this.repository.save({ id, ...updateSeriesDto });
    } catch (err) {
      throw new NotFoundException(`Series not found id=${id}`);
    }
  }

  async remove(id: number, loggedInDto: LoggedInDto) {
    try {
      await this.repository.findOneByOrFail({ 
        id, 
        user: { username: loggedInDto.username } 
      });
      return await this.repository.delete({ id });
    } catch (err) {
      throw new NotFoundException(`Series not found id=${id}`);
    }
  }
}
