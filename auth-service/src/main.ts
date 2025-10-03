import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Auth-service running on http://localhost:${port}`);
}
bootstrap();
