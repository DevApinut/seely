import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { IdDto } from '@app/common/dto/id.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtGuard } from '@app/auth/guards/optional-jwt.guard';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { paginateConfig } from './series.service';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PasswordRemoverInterceptor } from '@app/interceptors/password-remover.interceptor';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createSeriesDto: CreateSeriesDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.seriesService.create(createSeriesDto, req.user);
  }

  @UseGuards(OptionalJwtGuard)
  @ApiPaginationQuery(paginateConfig) 
  @Get()
  search(@Paginate() query: PaginateQuery, @Req() req: { user?: LoggedInDto }) {
    return this.seriesService.search(query, req.user);
  }

  @UseGuards(OptionalJwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user?: LoggedInDto }) {
    return this.seriesService.findOne(+id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.seriesService.update(+id, updateSeriesDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: LoggedInDto }) {
    return this.seriesService.remove(+id, req.user);
  }
}
