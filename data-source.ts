import { DataSource } from 'typeorm';

import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: '',
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: process.env.ENVIRONMENT === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/*.ts'],
});
