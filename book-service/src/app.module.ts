import { Controller, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Book } from './entities/book.entity';
import { BooksController } from './app.controller';
import { BooksService } from './app.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard.guard';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { ConsulModule } from './consul/consul.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    HttpModule,
    // Load env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.book',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'book_service'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),

     ConsulModule.register('book-service', 3002),
  ],
  controllers: [BooksController, HealthController],
  providers: [BooksService, JwtAuthGuard],

})
export class AppModule { }
