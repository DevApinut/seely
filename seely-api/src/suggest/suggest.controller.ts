import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { CreateSuggestDto } from './dto/create-suggest.dto';
import { UpdateSuggestDto } from './dto/update-suggest.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { IdDto } from '@app/common/dto/id.dto';

@Controller('suggest')
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createSuggestDto: CreateSuggestDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.suggestService.create(createSuggestDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSuggestDto: UpdateSuggestDto,
    @Req() req: { user: LoggedInDto },
  ) {
    return this.suggestService.update(+id, updateSuggestDto, req.user);
  }


  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(
    @Param() idDto: IdDto, 
    @Req() req: { user: LoggedInDto }
  
  ) {
    return this.suggestService.remove(idDto.id,req.user);
  }
}
