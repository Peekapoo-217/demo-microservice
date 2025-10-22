import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { ConsulService } from './consul/consul.service';  

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // Bật CORS cho frontend ReactJS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);

  //  Đăng ký service vào Consul
  const consulService = new ConsulService('auth-service', port);
  await consulService.onModuleInit();

  console.log(` Auth-service running on http://localhost:${port}`);
}
bootstrap();
