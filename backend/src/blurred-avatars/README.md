# Blurred Avatars Module

This module provides functionality to generate and manage blurred avatars for voice notes, enhancing privacy in Whisper's anonymous features.

## Features

- **Avatar Blurring**: Generate blurred versions of user avatars with configurable blur levels (1-10)
- **PostgreSQL Storage**: Store blurred avatar metadata and URLs in the database
- **Privacy Enhancement**: Maintain user anonymity during voice note interactions
- **RESTful API**: Simple endpoints for creating, retrieving, and managing blurred avatars

## Installation & Setup

### 1. Install Dependencies

```bash
npm install sharp
```

### 2. Database Migration

Run the migration to create the `blurred_avatars` table:

```bash
npm run migrate
```

This will execute the migration file: `1680000006000-CreateBlurredAvatarsTable.sql`

### 3. Environment Configuration

Add these optional environment variables to your `.env` file:

```env
# Upload path for blurred avatar images (default: ./uploads/blurred-avatars)
UPLOAD_PATH=./uploads/blurred-avatars

# Base URL for serving images (default: http://localhost:3001)
BASE_URL=http://localhost:3001
```

## API Endpoints

### Create Blurred Avatar

```http
POST /avatars/blur
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "blurLevel": 5,
  "originalImageUrl": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blurred avatar created successfully",
  "data": {
    "id": "avatar-uuid",
    "userId": "user-uuid",
    "blurLevel": 5,
    "imageUrl": "http://localhost:3001/uploads/blurred-avatars/user123_1234567890_blur5.jpg",
    "originalImageUrl": "https://example.com/avatar.jpg",
    "isActive": true,
    "createdAt": "2025-09-23T13:30:00.000Z",
    "updatedAt": "2025-09-23T13:30:00.000Z"
  }
}
```

### Get Blurred Avatars

```http
GET /avatars/blurred/:userId
Authorization: Bearer <jwt-token>

# Get latest avatar only
GET /avatars/blurred/:userId?latest=true
```

**Response:**

```json
{
  "success": true,
  "message": "Blurred avatars retrieved successfully",
  "data": [
    {
      "id": "avatar-uuid",
      "userId": "user-uuid",
      "blurLevel": 5,
      "imageUrl": "http://localhost:3001/uploads/blurred-avatars/user123_1234567890_blur5.jpg",
      "isActive": true,
      "createdAt": "2025-09-23T13:30:00.000Z",
      "updatedAt": "2025-09-23T13:30:00.000Z"
    }
  ]
}
```

### Get Avatar Stats

```http
GET /avatars/blurred/:userId/stats
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Blurred avatar stats retrieved successfully",
  "data": {
    "totalAvatars": 3,
    "latestBlurLevel": 5,
    "lastUpdated": "2025-09-23T13:30:00.000Z"
  }
}
```

### Update Blurred Avatar

```http
PATCH /avatars/blur/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "blurLevel": 8,
  "isActive": true
}
```

### Delete Blurred Avatar

```http
DELETE /avatars/blur/:id
Authorization: Bearer <jwt-token>
```

## Data Transfer Objects (DTOs)

### CreateBlurredAvatarDto

```typescript
{
  userId: string;           // UUID of the user
  blurLevel?: number;      // Blur intensity (1-10, default: 5)
  originalImageUrl: string; // URL of the original avatar image
}
```

### UpdateBlurredAvatarDto

```typescript
{
  blurLevel?: number;  // New blur level (1-10)
  isActive?: boolean;  // Active status
}
```

## Database Schema

The `blurred_avatars` table includes:

| Column           | Type         | Description               |
| ---------------- | ------------ | ------------------------- |
| id               | uuid         | Primary key               |
| userId           | varchar(255) | User identifier           |
| blurLevel        | integer      | Blur intensity (1-10)     |
| imageUrl         | varchar(500) | URL to the blurred image  |
| originalImageUrl | varchar(500) | URL to the original image |
| isActive         | boolean      | Active status             |
| createdAt        | timestamp    | Creation timestamp        |
| updatedAt        | timestamp    | Last update timestamp     |

## Testing

Run the tests with:

```bash
# Unit tests
npm run test -- blurred-avatars

# E2E tests
npm run test:e2e -- blurred-avatars

# Test coverage
npm run test:cov -- blurred-avatars
```

## Usage in Voice Notes

This module is designed to work with Whisper's voice note feature:

1. When a user creates a voice note, their avatar is automatically blurred
2. The blur level can be configured per user or per voice note
3. Blurred avatars enhance privacy while maintaining visual identity
4. Images are processed and stored securely with PostgreSQL metadata

## Image Processing

The module uses the Sharp library for high-quality image processing:

- **Blur Effect**: Gaussian blur with configurable intensity
- **Format**: JPEG output with 80% quality for optimal size/quality balance
- **Performance**: Async processing with error handling
- **Storage**: Local file system with configurable upload directory

## Security & Privacy

- All endpoints require JWT authentication
- Soft delete for avatar removal (data retention)
- Original image URLs are preserved for reprocessing
- Configurable blur levels for different privacy needs
- Indexed database queries for optimal performance

## Error Handling

The module includes comprehensive error handling:

- **BadRequestException**: Invalid image URLs or processing errors
- **NotFoundException**: Avatar not found for updates/deletions
- **Validation**: DTO validation for all input parameters
- **Logging**: Detailed logs for debugging and monitoring

## Integration

The BlurredAvatarsModule is automatically loaded in the main AppModule and can be imported into other modules that need avatar blurring functionality.

```typescript
import { BlurredAvatarsService } from './blurred-avatars/blurred-avatars.service';

// Inject the service to use avatar blurring
constructor(private blurredAvatarsService: BlurredAvatarsService) {}
```
