import { Module } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { SuggestController } from './suggest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suggest } from './entities/suggest.entity';
import { Series } from '@app/series/entities/series.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suggest, Series])],
  controllers: [SuggestController],
  providers: [SuggestService],
})
export class SuggestModule {}
