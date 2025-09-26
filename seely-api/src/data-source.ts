import { config } from 'dotenv'
import { DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  logging: true,
  url: process.env.DATABASE_URL
}