# BlurredAvatarsModule Usage Examples

## API Usage Examples

### 1. Create a Blurred Avatar

```bash
curl -X POST http://localhost:3001/avatars/blur \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "blurLevel": 6,
    "originalImageUrl": "https://example.com/avatar.jpg"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Blurred avatar created successfully",
  "data": {
    "id": "avatar-uuid",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "blurLevel": 6,
    "imageUrl": "http://localhost:3001/uploads/blurred-avatars/user123_1234567890_blur6.jpg",
    "originalImageUrl": "https://example.com/avatar.jpg",
    "isActive": true,
    "createdAt": "2025-09-23T13:30:00.000Z",
    "updatedAt": "2025-09-23T13:30:00.000Z"
  }
}
```

### 2. Get Latest Blurred Avatar

```bash
curl -X GET "http://localhost:3001/avatars/blurred/123e4567-e89b-12d3-a456-426614174000?latest=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get All Blurred Avatars for User

```bash
curl -X GET http://localhost:3001/avatars/blurred/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Avatar Statistics

```bash
curl -X GET http://localhost:3001/avatars/blurred/123e4567-e89b-12d3-a456-426614174000/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Blurred avatar stats retrieved successfully",
  "data": {
    "totalAvatars": 3,
    "latestBlurLevel": 6,
    "lastUpdated": "2025-09-23T13:30:00.000Z"
  }
}
```

### 5. Update Blur Level

```bash
curl -X PATCH http://localhost:3001/avatars/blur/avatar-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "blurLevel": 8
  }'
```

### 6. Remove Blurred Avatar

```bash
curl -X DELETE http://localhost:3001/avatars/blur/avatar-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Service Integration Examples

### Using in Another Service

```typescript
import { Injectable } from '@nestjs/common';
import { BlurredAvatarsService } from '../blurred-avatars/blurred-avatars.service';

@Injectable()
export class VoiceNotesService {
  constructor(private readonly blurredAvatarsService: BlurredAvatarsService) {}

  async createVoiceNote(userId: string, content: string) {
    // Get the user's blurred avatar for privacy
    const blurredAvatar =
      await this.blurredAvatarsService.findLatestByUserId(userId);

    if (!blurredAvatar) {
      // Create a default blurred avatar if none exists
      await this.blurredAvatarsService.createBlurredAvatar({
        userId,
        blurLevel: 5,
        originalImageUrl: 'https://example.com/default-avatar.jpg',
      });
    }

    // Use blurred avatar in voice note...
    return {
      content,
      avatarUrl: blurredAvatar?.imageUrl,
      isPrivate: true,
    };
  }
}
```

### WebSocket Integration

```typescript
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { BlurredAvatarsService } from '../blurred-avatars/blurred-avatars.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly blurredAvatarsService: BlurredAvatarsService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(client: any, payload: any) {
    const { userId, message, isAnonymous } = payload;

    let avatarUrl = payload.avatarUrl;

    if (isAnonymous) {
      // Use blurred avatar for anonymous messages
      const blurredAvatar =
        await this.blurredAvatarsService.findLatestByUserId(userId);
      avatarUrl = blurredAvatar?.imageUrl || null;
    }

    // Broadcast message with appropriate avatar
    this.server.emit('message', {
      userId: isAnonymous ? null : userId,
      message,
      avatarUrl,
      timestamp: new Date(),
    });
  }
}
```

## Testing Examples

### Jest Unit Test

```typescript
describe('BlurredAvatarsService', () => {
  let service: BlurredAvatarsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BlurredAvatarsService /* ... */],
    }).compile();

    service = module.get<BlurredAvatarsService>(BlurredAvatarsService);
  });

  it('should create blurred avatar with default blur level', async () => {
    const createDto = {
      userId: 'test-user-id',
      originalImageUrl: 'https://example.com/avatar.jpg',
    };

    const result = await service.createBlurredAvatar(createDto);

    expect(result.blurLevel).toBe(5); // default
    expect(result.userId).toBe(createDto.userId);
    expect(result.imageUrl).toContain('blur5');
  });
});
```

### Integration Test with Supertest

```typescript
describe('BlurredAvatarsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get JWT token for authentication
    jwtToken = await getAuthToken(app);
  });

  it('/avatars/blur (POST)', () => {
    return request(app.getHttpServer())
      .post('/avatars/blur')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        userId: 'test-user-id',
        blurLevel: 7,
        originalImageUrl: 'https://example.com/test.jpg',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.blurLevel).toBe(7);
      });
  });
});
```

## Configuration Examples

### Environment Variables

```env
# .env file
UPLOAD_PATH=./uploads/blurred-avatars
BASE_URL=http://localhost:3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=whspr_user
DB_PASSWORD=yourpassword
DB_NAME=whspr
```

### Custom Configuration Module

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => ({
          blurredAvatars: {
            uploadPath:
              process.env.AVATAR_UPLOAD_PATH || './uploads/blurred-avatars',
            baseUrl: process.env.BASE_URL || 'http://localhost:3001',
            defaultBlurLevel: parseInt(process.env.DEFAULT_BLUR_LEVEL || '5'),
            maxBlurLevel: parseInt(process.env.MAX_BLUR_LEVEL || '10'),
          },
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

## Error Handling Examples

### Custom Error Handling

```typescript
try {
  const blurredAvatar =
    await this.blurredAvatarsService.createBlurredAvatar(createDto);
  return { success: true, data: blurredAvatar };
} catch (error) {
  if (error instanceof BadRequestException) {
    return {
      success: false,
      error: 'Invalid request parameters',
      details: error.message,
    };
  }

  throw new InternalServerErrorException(
    'An unexpected error occurred while processing the avatar',
  );
}
```

### Validation Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "blurLevel must be a number between 1 and 10",
    "originalImageUrl must be a valid URL"
  ],
  "error": "Bad Request"
}
```

## Database Query Examples

### Raw SQL Queries (if needed)

```sql
-- Find all blurred avatars for a user
SELECT * FROM blurred_avatars
WHERE "userId" = $1 AND "isActive" = true
ORDER BY "createdAt" DESC;

-- Get avatar statistics
SELECT
  COUNT(*) as total_avatars,
  AVG("blurLevel") as avg_blur_level,
  MAX("updatedAt") as last_updated
FROM blurred_avatars
WHERE "userId" = $1 AND "isActive" = true;

-- Clean up old inactive avatars
DELETE FROM blurred_avatars
WHERE "isActive" = false
AND "updatedAt" < NOW() - INTERVAL '30 days';
```

## Performance Optimization Tips

1. **Image Processing**: Process images asynchronously for better performance
2. **Caching**: Cache frequently accessed blurred avatars
3. **Compression**: Use appropriate JPEG quality settings
4. **CDN**: Serve images from a CDN for faster delivery
5. **Database Indexes**: Ensure proper indexing on frequently queried columns

## Security Considerations

1. **Authentication**: All endpoints require JWT authentication
2. **Authorization**: Users can only access their own avatars
3. **Input Validation**: All DTOs include comprehensive validation
4. **File Upload**: Validate file types and sizes
5. **Rate Limiting**: Implement rate limiting for image processing endpoints
