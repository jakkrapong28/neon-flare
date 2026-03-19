import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3005',      // พอร์ตมาตรฐานของ Next.js (Frontend)
      process.env.FRONTEND_URL,     // URL จริงตอนขึ้น Railway
    ].filter(Boolean) as string[],  // กรองค่าว่างและบอก Type ให้ชัดเจน
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3005; // ใช้พอร์ตจาก Cloud หรือ 3005
  
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Backend is running on: http://localhost:${port}/api`);
}
bootstrap();