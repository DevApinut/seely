// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggedInDto } from '../dto/logged-in.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    // Authentication: Bearer <token>
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`
    })
  }

  validate(user: LoggedInDto): LoggedInDto {
    return user;
  }
}
