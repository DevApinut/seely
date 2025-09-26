import { PasswordRemoverInterceptor } from '@app/interceptors/password-remover.interceptor';
import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /users/me + jwt-token
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(PasswordRemoverInterceptor)
  @Get('me')
  findByUsername(@Req() req: { user: LoggedInDto }) {
    return this.usersService.findByUsername(req.user.username)
  }

}
