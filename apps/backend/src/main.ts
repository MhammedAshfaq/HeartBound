process.env.TZ = 'UTC';

import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ErrorHandlerService } from '@common/services/error-handler.service';
import { EnvConfig } from '@config/env.config';
import { TraceIdInterceptor } from '@interceptors/trace-id.interceptor';
import { TracingInterceptor } from '@interceptors/tracing.interceptor';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { HttpLoggingInterceptor } from '@interceptors/logging.interceptor';
import { LoggerService } from '@logger/logger.service';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const environment = process.env['NODE_ENV'] || 'development';
  const isProd = environment === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: false,
    bufferLogs: false,
    rawBody: true,
  });

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  app.use(helmet());

  const configService = app.get(ConfigService<EnvConfig>);
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Accept, Authorization, x-forwarded-for, x-client-ip, x-real-ip, referer, user-agent',
  });

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Healthy-Relationship Backend APIs')
      .setDescription('API documentation for Healthy-Relationship backend services')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  const errorHandler = app.get(ErrorHandlerService);
  app.useGlobalFilters(new HttpExceptionFilter(errorHandler));
  app.useGlobalInterceptors(
    new TraceIdInterceptor(),
    new TracingInterceptor(),
    new TransformInterceptor(),
    new HttpLoggingInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'assets'), { prefix: '/assets/' });
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  const expressApp = app.getHttpAdapter().getInstance() as any;
  expressApp.get(['/', '/v1'], (_: any, res: any) => {
    res.status(200).render('default', {
      app: 'Healthy-Relationship Backend Service',
      environment,
      isProd,
      message: isProd
        ? 'You are hitting a wrong URL. Please check the official API documentation.'
        : 'Welcome to the Healthy-Relationship backend service.',
    });
  });

  const port = process.env['PORT'] || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`App is running on port ${port}`, 'Healthy-Relationship');
}

bootstrap();
