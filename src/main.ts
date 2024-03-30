import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';
import { ValidationPipe } from '@nestjs/common';
import { RemoveSensitiveUserInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  // 添加数据校验
  app.useGlobalPipes(new ValidationPipe());
  // 创建文档
  generateDocument(app);
  app.useGlobalInterceptors(new RemoveSensitiveUserInfoInterceptor());

  await app.listen(3000);
}
bootstrap();
