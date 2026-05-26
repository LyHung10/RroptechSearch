import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Bật CORS để Frontend Next.js gọi được API
  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`[NestJS] Backend đang chạy tại: http://localhost:${port}`);
}
bootstrap();
