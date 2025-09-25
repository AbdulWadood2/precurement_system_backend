// src/swagger/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as basicAuth from 'express-basic-auth';
import * as swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';

export function setupSwagger(app: INestApplication) {
  // Try to read custom CSS, but handle cases where file doesn't exist (like in Vercel)
  let customCss = '';
  try {
    customCss = readFileSync(
      join(process.cwd(), 'public/css/dark-theme.css'),
      'utf8',
    );
  } catch (error) {
    // If file doesn't exist (e.g., in Vercel deployment), use empty string
    console.log('Custom CSS file not found, using default Swagger styling');
  }

  const config = new DocumentBuilder()
    .setTitle('Language Learning API')
    .setDescription('API documentation for Language Learning application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerUsername = process.env.SWAGGER_USERNAME;
  const swaggerPassword = process.env.SWAGGER_PASSWORD;

  // Serve the Swagger JSON at a specific endpoint
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/api-docs-json', (req: Request, res: Response) => {
    res.json(document);
  });

  if (swaggerUsername && swaggerPassword) {
    expressApp.use(
      '/api-docs',
      basicAuth({
        users: {
          [swaggerUsername]: swaggerPassword,
        },
        challenge: true,
        realm: 'API Documentation',
      }),
    );
  } else {
    expressApp.use('/api-docs', (req: Request, res: Response) =>
      res.status(401).send('Unauthorized'),
    );
  }

  // Serve Swagger UI with CDN-hosted assets for Vercel compatibility
  expressApp.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customCss,
      customSiteTitle: 'Language Learning API',
      customfavIcon:
        'https://unpkg.com/swagger-ui-dist@5.9.0/favicon-32x32.png',
      swaggerOptions: {
        url: '/api-docs-json', // Endpoint to serve the Swagger JSON
      },
      customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
      ],
    }),
  );
}
