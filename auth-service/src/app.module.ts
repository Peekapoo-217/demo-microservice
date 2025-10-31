import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt.strategy';
import { AuthController } from './app.controller';
import { User } from './entities/user.entity';
import { AuthService } from './app.service';
import { HealthController } from './health.controller';
import { ConsulModule } from '@registry/consul';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.app',
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
        database: configService.get<string>('DB_NAME', 'nest_auth_service'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),

    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    ConsulModule.register({
      serviceName: 'auth-service',
      servicePort: Number(process.env.PORT) || 3001,
    }),
 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secretKey'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController, HealthController ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, PassportModule],
})
export class AuthModule { }