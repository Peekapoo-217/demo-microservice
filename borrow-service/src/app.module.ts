import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { Borrow } from './entities/borrow.entity';
import { JwtAuthGuard } from './guards/JwtAuthGuard.guard';
import { BorrowService } from './app.service';

import { BorrowController } from './app.controller';
import { HealthController } from './health.controller';
import { ConsulModule } from './consul/consul.module';

@Module({
  imports: [
    HttpModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.borrow',
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
        database: configService.get<string>('DB_NAME', 'borrow_service'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),

    ConsulModule.register('borrow-service', 3003),

    TypeOrmModule.forFeature([Borrow]),
  ],

  controllers: [BorrowController, HealthController],
  providers: [BorrowService, JwtAuthGuard],
})
export class AppModule { }
