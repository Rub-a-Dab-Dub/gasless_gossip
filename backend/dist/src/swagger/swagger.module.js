"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SwaggerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerModule = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
Object.defineProperty(exports, "SwaggerModule", { enumerable: true, get: function () { return swagger_1.SwaggerModule; } });
let SwaggerModule = SwaggerModule_1 = class SwaggerModule {
    static setupSwagger(app) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Whisper API')
            .setDescription('Comprehensive API for Whisper social platform with gossip, rooms, XP, and wallet features')
            .setVersion('1.0.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
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
        const document = SwaggerModule_1.createDocument(app, config);
        SwaggerModule_1.setup('api-docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                filter: true,
                showRequestHeaders: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                requestInterceptor: (req) => {
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
};
exports.SwaggerModule = SwaggerModule;
exports.SwaggerModule = swagger_1.SwaggerModule = SwaggerModule_1 = __decorate([
    (0, common_1.Module)({})
], swagger_1.SwaggerModule);
//# sourceMappingURL=swagger.module.js.map