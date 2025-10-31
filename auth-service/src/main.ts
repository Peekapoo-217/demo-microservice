import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // Bật CORS cho frontend ReactJS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`port: http://localhost:${port}`);
}
bootstrap();
