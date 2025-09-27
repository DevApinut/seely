// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesModule } from './series/series.module';
import { RatingModule } from './rating/rating.module';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from './data-source';
import { SuggestModule } from './suggest/suggest.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ConfigifyModule } from '@itgorillaz/configify';

@Module({
  imports: [
   TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === 'local', // sync only local
      })
    }),
    ConfigifyModule.forRootAsync(),
    SeriesModule,
    RatingModule,
    UsersModule,
    AuthModule,
    SuggestModule,    
  ],
  controllers: [AppController],
  providers: [ { provide: APP_PIPE, useClass: ZodValidationPipe },AppService, JwtStrategy],
})
export class AppModule {}