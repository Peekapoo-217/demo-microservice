import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsulService } from './consul/consul.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3003;
  await app.listen(port);

  const consulService = new ConsulService('borrow-service', port);
  await consulService.onModuleInit();

  console.log(` Borrow-Service running at http://localhost:${port}`);
}
bootstrap();
