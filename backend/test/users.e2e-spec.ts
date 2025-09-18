import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      const createUserDto = {
        username: 'whispertest',
        email: 'whisper@test.com',
        pseudonym: 'The Mysterious Whisperer',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.username).toBe(createUserDto.username);
          expect(response.body.email).toBe(createUserDto.email);
          expect(response.body.pseudonym).toBe(createUserDto.pseudonym);
          createdUserId = response.body.id;
        });
    });

    it('should fail with invalid data', () => {
      const invalidUserDto = {
        username: 'ab', // too short
        email: 'invalid-email',
        pseudonym: '',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(401);
    });
  });

  describe('Stellar Integration', () => {
    it('should validate Stellar account format', () => {
      const userWithInvalidStellar = {
        username: 'stellaruser',
        email: 'stellar@test.com',
        pseudonym: 'Stellar Whisperer',
        stellarAccountId: 'invalid-stellar-id',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(userWithInvalidStellar)
        .expect(400);
    });

    it('should accept valid Stellar account', () => {
      const userWithValidStellar = {
        username: 'stellaruser2',
        email: 'stellar2@test.com',
        pseudonym: 'Stellar Whisperer 2',
        stellarAccountId: 'GCKFBEIYTKP5RDBXSGBLQWJFWJQJ5PFYBYZ6KQLPVX4WWQCAHHWFMXJ5',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(userWithValidStellar)
        .expect(201);
    });
  });
});