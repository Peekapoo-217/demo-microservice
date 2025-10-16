import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Book } from 'src/entities/book.entity';

dotenv.config({ path: '.env.book' });

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Book],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
