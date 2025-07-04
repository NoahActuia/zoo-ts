import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Add request logging middleware
  app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    console.log('📨 Headers:', {
      authorization: req.headers.authorization,
      'content-type': req.headers['content-type'],
      origin: req.headers.origin,
    });
    next();
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Zoo API')
    .setDescription('The Zoo API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
