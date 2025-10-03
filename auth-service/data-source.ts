// data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/entities/user.entity';

dotenv.config({ path: '.env.database' });

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
