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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    SeriesModule,
    RatingModule,
    UsersModule,
    AuthModule,
    SuggestModule,    
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}