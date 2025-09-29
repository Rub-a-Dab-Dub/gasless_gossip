import { Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerModule {
  static setupSwagger(app: any) {
    const config = new DocumentBuilder()
      .setTitle('Whisper API')
      .setDescription('Comprehensive API for Whisper social platform with gossip, rooms, XP, and wallet features')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', 'User authentication and authorization endpoints')
      .addTag('Gossip', 'Gossip intents and real-time updates')
      .addTag('Rooms', 'Secret rooms and room management')
      .addTag('XP & Levels', 'User experience points and leveling system')
      .addTag('Wallet', 'Multi-network wallet balance management')
      .addTag('Polls', 'Room polls and voting system')
      .addTag('Chat History', 'Chat message history and performance')
      .addTag('Rate Limiting', 'Rate limiting and abuse prevention')
      .addTag('Error Handling', 'Global error handling and logging')
      .addTag('Token Gifts', 'Gasless token gifting with Base paymaster')
      .addTag('Health', 'System health and monitoring')
      .addServer('http://localhost:3001', 'Development server')
      .addServer('https://api.whisper.com', 'Production server')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
          // Add common headers for all requests
          req.headers['Content-Type'] = 'application/json';
          return req;
        },
      },
      customSiteTitle: 'Whisper API Documentation',
      customfavIcon: '/favicon.ico',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #3b82f6; }
        .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
      `,
    });

    return document;
  }
}
