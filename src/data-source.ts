import 'reflect-metadata';
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'host.docker.internal',
  port: 3307,
  username: 'root',
  password: '',
  database: 'aeroerp',
  migrationsTableName: 'migrations',
  logging: process.env.NODE_ENV === 'development',
  synchronize: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/*.ts'],
});
