import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Error Budget Controller API')
    .setDescription('Control Plane API for Error Budget management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // API routes (must be before static files)
  app.setGlobalPrefix('api');

  // Serve static files (React dashboard) - only for non-API routes
  const dashboardPath = join(__dirname, '..', 'dashboard', 'build');
  const expressApp = app.getHttpAdapter().getInstance();
  
  // Serve static files, but exclude /api routes
  expressApp.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next(); // Let NestJS handle API routes
    }
    express.static(dashboardPath)(req, res, next);
  });
  
  // Catch-all handler: send back React's index.html for client-side routing
  // This only runs if no other route matched (including API routes)
  expressApp.get('*', (req, res) => {
    // Don't serve index.html for API routes (shouldn't reach here, but safety check)
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(join(dashboardPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Control Plane running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api`);
}

bootstrap();
