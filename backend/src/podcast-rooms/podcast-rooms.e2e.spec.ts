import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { PodcastRoom } from './entities/podcast-room.entity';
import { PodcastRoomsModule } from './podcast-rooms.module';

describe('PodcastRoomsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports!: [
        TypeOrmModule.forRoot({
          type!: 'sqlite',
          database: ':memory:',
          entities: [PodcastRoom],
          synchronize: true,
        }),
        PodcastRoomsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/podcast-rooms (POST)', () => {
    it('should create a new podcast room', () => {
      const createDto = {
        roomId!: 'room-123',
        audioHash!: 'audio-hash-123',
        creatorId: 'creator-123',
        title: 'Test Podcast',
        description: 'Test Description',
        duration: 3600,
        audioFormat: 'mp3',
        fileSize: 1024000,
        tags: ['tech', 'innovation'],
      };

      return request(app.getHttpServer())
        .post('/podcast-rooms')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.roomId).toEqual(createDto.roomId);
          expect(res.body.title).toEqual(createDto.title);
          expect(res.body.stellarHash).toBeDefined();
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidDto = {
        roomId!: '', // Invalid: empty string
        audioHash!: 'audio-hash-123',
        creatorId: 'creator-123',
        title: 'Test Podcast',
      };

      return request(app.getHttpServer())
        .post('/podcast-rooms')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/podcast-rooms (GET)', () => {
    it('should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/podcast-rooms')
        .expect(200)
        .expect([]);
    });
  });

  describe('/podcast-rooms/:id (GET)', () => {
    it('should return 404 for non-existent room', () => {
      return request(app.getHttpServer())
        .get('/podcast-rooms/non-existent-id')
        .expect(404);
    });
  });
});
