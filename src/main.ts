import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {ClassSerializerInterceptor, ConsoleLogger, ValidationPipe} from "@nestjs/common";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Dashboard Server',
      logLevels: ['log', 'error', 'debug', 'warn', 'fatal', 'verbose'],
      colors: true,
      sorted: true,
      json: true,
      compact: false,
    })
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  const config = new DocumentBuilder()
      .setTitle('Dashboard')
      .setDescription('The dashboard API description')
      .setVersion('1.0')
      .addTag('dashboard')
      .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close())
  }
}
bootstrap();
