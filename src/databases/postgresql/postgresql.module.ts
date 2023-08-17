import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import envValidator from './validators/env.validator';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: envValidator,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        namingStrategy: new SnakeNamingStrategy(),
        entities: ['dist/databases/postgresql/models/*.js'],
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
        migrations: ['dist/databases/postgresql/migrations/*.js'],
        migrationsTableName: 'migrations_typeorm',
        ssl: configService.get('DB_IS_SSL') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export default class PostgresqlModule {}
