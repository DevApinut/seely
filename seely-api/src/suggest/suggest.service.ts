import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuggestDto } from './dto/create-suggest.dto';
import { UpdateSuggestDto } from './dto/update-suggest.dto';
import { Repository } from 'typeorm';
import { Suggest } from './entities/suggest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';

@Injectable()
export class SuggestService {
  constructor(
    @InjectRepository(Suggest)
    private readonly repository: Repository<Suggest>,
  ) {}

  create(createSuggestDto: CreateSuggestDto, loggedInDto: LoggedInDto) {
    return this.repository.save({
      ...createSuggestDto,
      user: { username: loggedInDto.username },
    });
  }

  findAll() {
    return `This action returns all suggest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} suggest`;
  }

  update(
    id: number,
    updateSuggestDto: UpdateSuggestDto,
    loggedInDto: LoggedInDto,
  ) {
    return this.repository
      .findOneByOrFail({ series_id : id, user: { username: loggedInDto.username } })
      .then((res) => this.repository.save({ id:res.id, ...updateSuggestDto,username: loggedInDto.username  }))
      .catch(() => {
        throw new NotFoundException(`Not found: id=${id}`);
      });
  }

  async remove(id: number, loggedInDto: LoggedInDto) {
    try {
      const res = await this.repository.findOneByOrFail({ 
        series_id: id, 
        user: { username: loggedInDto.username } 
      });      
      await this.repository.delete({ id: res.id });
      return "delete success";
    } catch (error) {
      throw new NotFoundException(`Not found: id=${id}`);
    }
  }
  }

