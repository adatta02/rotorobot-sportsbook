import { DataSource } from "typeorm";
const dotenv = require('dotenv');
dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entity/**/*.ts'],
  synchronize: true
});

export async function init() {
  await AppDataSource.initialize();
  return AppDataSource;
}

export function getDatasource() {
  return AppDataSource;
}