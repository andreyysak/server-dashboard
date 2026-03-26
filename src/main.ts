import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Dashboard Server',
      logLevels: ['log', 'error', 'debug', 'warn', 'fatal', 'verbose'],
      colors: true,
      sorted: true,
      json: false, // Changed for better readability in dev
      compact: false,
    }),
  });

  app.enableCors({
    origin: [
      'http://localhost:5187',
      'http://localhost:5173',
      'http://8.211.44.164',
      'http://8.211.44.164.nip.io',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Guards, Interceptors, Filters, Pipes
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422, // Set to 422 for validation errors
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Dashboard API')
    .setDescription('The dashboard API description and documentation')
    .setVersion('1.0')
    .addTag('Dashboard')
    .addBearerAuth() // Ensure documentation includes JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  // Note: module.hot is usually handled by dev server
}
bootstrap();
