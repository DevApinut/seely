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
        .leftJoin('series.suggests', 'suggests', 
          'suggests.series_id = series.id AND suggests.username = :username', 
          { username: loggedInDto.username })
        .addSelect(['suggests.series_id', 'suggests.score'])
        .leftJoin('suggests.user', 'suggestUser')
        .addSelect(['suggestUser.username', 'suggestUser.role'])
        .andWhere('seriesUser.username = :username', 
          { username: loggedInDto.username });
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
      averageScore: parseFloat(parseFloat(result.averageScore).toFixed(2)) || 0
    };
  }

  // for init to create data
  async onModuleInit() {
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.save([
        // Example 1 - Netflix Series
        {
          name: 'Stranger Things',
          year: 2016,
          review:
            'A nostalgic sci-fi horror series that perfectly captures 80s nostalgia while delivering compelling supernatural mysteries and strong character development.',
          imageUrl: 'https://example.com/images/stranger-things.jpg',
          rating: { id: 3 }   
        },

        // Example 2 - HBO Series
        {
          name: 'Game of Thrones',
          year: 2011,
          review:
            'Epic fantasy drama with complex political intrigue, memorable characters, and stunning production values, though later seasons were divisive.',
          imageUrl: 'https://example.com/images/game-of-thrones.jpg',
          rating: { id: 4 }   
        },

        // Example 3 - Comedy Series
        {
          name: 'The Office',
          year: 2005,
          review:
            'Hilarious mockumentary-style comedy about office life with perfect character chemistry and quotable moments that remain timeless.',
          imageUrl: 'https://example.com/images/the-office.jpg',
          rating: { id: 6 }   
        },

        // Example 4 - Anime Series
        {
          name: 'Attack on Titan',
          year: 2013,
          review:
            'Dark and intense anime with incredible world-building, complex themes about freedom and humanity, and jaw-dropping plot twists.',
          imageUrl: 'https://example.com/images/attack-on-titan.jpg',
          rating: { id: 4 }   
        },

        // Example 5 - Crime Drama
        {
          name: 'Breaking Bad',
          year: 2008,
          review:
            'Masterful character study of moral decay with exceptional writing, acting, and cinematography that creates television history.',
          imageUrl: 'https://example.com/images/breaking-bad.jpg',
          rating: { id: 2 }   
        },

        // Example 6 - Thai Series
        {
          name: 'The Empress of Ayodhaya',
          year: 2022,
          review:
            'ซีรีส์ไทยที่มีเนื้อเรื่องเข้มข้น เล่าเรื่องราวทางประวัติศาสตร์ที่น่าสนใจ พร้อมการแสดงที่ประทับใจ',
          imageUrl: 'https://example.com/images/empress-ayodhaya.jpg',
          rating: { id: 1 }
        },

        // Example 7 - Documentary Series
        {
          name: 'Our Planet',
          year: 2019,
          review:
            'Breathtaking nature documentary series with stunning cinematography that showcases the beauty and fragility of our natural world.',
          imageUrl: 'https://example.com/images/our-planet.jpg', 
          rating: { id: 3 }         
        },
      ]);
    }
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
          averageScore: stats.averageScore
        };
      })
    );

    return {
      data: dataWithStats,
      meta: page.meta,
    };
  }

  async findOne(id: number, loggedInDto?: LoggedInDto) {
    const series = await this.queryTemplate(loggedInDto).where('series.id = :id', { id }).getOne();
    
    if (series) {
      const stats = await this.getSeriesStats(series.id);
      return {
        ...series,
        totalSuggests: stats.totalSuggests,
        averageScore: stats.averageScore
      };
    }
    
    return series;
  }

  async update(
    id: number,
    updateSeriesDto: UpdateSeriesDto,
    loggedInDto: LoggedInDto,
  ) {
    return this.repository
      .findOneByOrFail({ id, user: { username: loggedInDto.username } })
      .then(() => this.repository.save({ id, ...updateSeriesDto }))
      .catch((err) => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }

  remove(id: number, loggedInDto: LoggedInDto) {
    return this.repository
      .findOneByOrFail({ id, user: { username: loggedInDto.username } })
      .then(() => this.repository.delete({ id }))
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }
}
