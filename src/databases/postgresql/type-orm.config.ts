import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/databases/postgresql/models/*.ts'],
  migrations: ['src/databases/postgresql/migrations/*.ts'],
  migrationsTableName: 'migrations_typeorm',
  ssl: process.env.DB_IS_SSL === 'true',
  namingStrategy: new SnakeNamingStrategy(),
});
