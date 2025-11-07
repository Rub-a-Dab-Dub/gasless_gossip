import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @param app  An instance of the INestApplication to enable us configure swagger and add a path to load up our docs
 */
export function setupDocumentationServer(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Gasless Gossip API Documentation')
    .setDescription('Messaging service API endpoints docs.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
