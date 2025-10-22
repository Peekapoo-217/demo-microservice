import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsulService } from './consul/consul.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3002;
  await app.listen(port);

  const consulService = new ConsulService('book-service', port);
  await consulService.onModuleInit();

  console.log(` Book-Service running at http://localhost:${port}`);
}
bootstrap();
