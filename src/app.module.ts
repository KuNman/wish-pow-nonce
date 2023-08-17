import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import WishModule from './wish/wish.module';
import PostgresqlModule from './databases/postgresql/postgresql.module';
import envValidator from './env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidator,
      isGlobal: true,
    }),
    PostgresqlModule,
    WishModule,
  ],
})

export default class AppModule {}
