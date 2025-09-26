# Social Sharing Module

## Overview

The SocialSharingModule allows users to share secrets, gifts, achievements, NFTs, and other content on social media platforms like X (Twitter), Facebook, LinkedIn, and more. The module tracks shares in PostgreSQL and awards Stellar XP rewards to incentivize social sharing.

## Features

- **Multi-platform Support**: Share to X, Facebook, LinkedIn, Discord, Telegram, Reddit, and other platforms
- **Content Type Tracking**: Track different types of content (secrets, gifts, achievements, NFTs, level-ups, badges)
- **XP Rewards**: Automatic Stellar XP rewards based on content type and platform
- **Shareable URLs**: Generate platform-specific sharing URLs
- **Analytics**: Track sharing statistics and engagement
- **Mock Content Generation**: Generate test content for development and testing

## Database Schema

### Share Entity

```sql
CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('secret', 'gift', 'achievement', 'nft', 'level_up', 'badge')),
    content_id UUID,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'x', 'facebook', 'linkedin', 'discord', 'telegram', 'reddit', 'other')),
    share_url TEXT,
    external_url TEXT,
    share_text TEXT,
    metadata JSONB,
    xp_awarded INTEGER DEFAULT 0,
    stellar_tx_id VARCHAR(64),
    is_successful BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Authentication
All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### Create Share
```http
POST /shares
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "contentType": "secret",
  "contentId": "optional-uuid",
  "platform": "x",
  "shareText": "Check this out!",
  "metadata": {
    "customField": "value"
  }
}
```

**Response:**
```json
{
  "id": "share-uuid",
  "userId": "user-uuid",
  "contentType": "secret",
  "platform": "x",
  "shareUrl": "https://whspr.app/secrets/shared",
  "externalUrl": "https://twitter.com/intent/tweet?url=...",
  "shareText": "Check this out!",
  "xpAwarded": 22,
  "isSuccessful": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get User Shares
```http
GET /shares/user/{userId}?limit=20&offset=0&contentType=secret&platform=x
Authorization: Bearer <jwt_token>
```

### Get My Shares
```http
GET /shares/my?limit=20&offset=0
Authorization: Bearer <jwt_token>
```

### Get All Shares
```http
GET /shares?userId=user-uuid&contentType=secret&platform=x&startDate=2024-01-01&endDate=2024-12-31&limit=20&offset=0
Authorization: Bearer <jwt_token>
```

### Get Share by ID
```http
GET /shares/{shareId}
Authorization: Bearer <jwt_token>
```

### Get Share Statistics
```http
GET /shares/stats/overview
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "totalShares": 1250,
  "totalXpAwarded": 25000,
  "platformBreakdown": {
    "x": 500,
    "facebook": 300,
    "linkedin": 250,
    "discord": 100,
    "telegram": 50,
    "reddit": 30,
    "other": 20
  },
  "contentTypeBreakdown": {
    "secret": 400,
    "nft": 300,
    "achievement": 250,
    "gift": 150,
    "level_up": 100,
    "badge": 50
  }
}
```

### Get My Share Statistics
```http
GET /shares/stats/my
Authorization: Bearer <jwt_token>
```

### Generate Mock Share Content
```http
POST /shares/mock/{contentType}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "shareText": "🔐 I just discovered an amazing secret on Whspr! Check it out and see what you can find! #WhsprSecrets #Crypto",
  "metadata": {
    "type": "secret_discovery",
    "userLevel": "explorer"
  },
  "suggestedPlatforms": ["x", "facebook", "linkedin", "discord"]
}
```

## XP Reward System

### Base XP Rewards by Content Type
- **Secret**: 15 XP
- **Gift**: 10 XP
- **Achievement**: 20 XP
- **NFT**: 25 XP
- **Level Up**: 30 XP
- **Badge**: 20 XP

### Platform Multipliers
- **X/Twitter**: 1.5x (50% bonus)
- **LinkedIn**: 1.3x (30% bonus)
- **Facebook**: 1.2x (20% bonus)
- **Reddit**: 1.1x (10% bonus)
- **Discord/Telegram/Other**: 1.0x (no bonus)

### Example XP Calculations
- Sharing a secret on X: 15 × 1.5 = 22 XP
- Sharing an NFT on LinkedIn: 25 × 1.3 = 32 XP
- Sharing an achievement on Facebook: 20 × 1.2 = 24 XP

## Content Types

### ContentType Enum
```typescript
enum ContentType {
  SECRET = 'secret',
  GIFT = 'gift',
  ACHIEVEMENT = 'achievement',
  NFT = 'nft',
  LEVEL_UP = 'level_up',
  BADGE = 'badge',
}
```

### Platform Enum
```typescript
enum Platform {
  TWITTER = 'twitter',
  X = 'x',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  REDDIT = 'reddit',
  OTHER = 'other',
}
```

## Configuration

### Environment Variables
```env
APP_BASE_URL=https://whspr.app  # Base URL for generating shareable links
```

### Database Migration
Run the migration to create the shares table:
```bash
npm run migrate
```

## Usage Examples

### Frontend Integration

```typescript
// Create a share
const createShare = async (contentType: string, platform: string, contentId?: string) => {
  const response = await fetch('/api/shares', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      contentType,
      platform,
      contentId,
      shareText: 'Check this out!'
    })
  });
  
  const share = await response.json();
  
  // Open the external sharing URL
  window.open(share.externalUrl, '_blank');
  
  return share;
};

// Get user's share history
const getMyShares = async () => {
  const response = await fetch('/api/shares/my?limit=50', {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  return response.json();
};
```

### Backend Service Integration

```typescript
import { SocialSharingService } from './social-sharing/social-sharing.service';

@Injectable()
export class MyService {
  constructor(private readonly socialSharingService: SocialSharingService) {}
  
  async handleUserAchievement(userId: string, achievementId: string) {
    // ... handle achievement logic ...
    
    // Automatically create a share for the achievement
    await this.socialSharingService.createShare({
      contentType: ContentType.ACHIEVEMENT,
      platform: Platform.X, // Default platform
      contentId: achievementId,
    }, userId);
  }
}
```

## Testing

### Unit Tests
```bash
npm test social-sharing.service.spec.ts
npm test social-sharing.controller.spec.ts
```

### Mock Share Generation
Use the mock endpoint to generate test content:
```bash
curl -X POST http://localhost:3000/shares/mock/secret \
  -H "Authorization: Bearer <token>"
```

## Error Handling

The module handles various error scenarios:
- **User not found**: Returns 404 when trying to create a share for non-existent user
- **XP award failure**: Marks share as unsuccessful but doesn't fail the entire operation
- **Invalid content type/platform**: Validation errors returned with 400 status
- **Database errors**: Proper error logging and user-friendly error messages

## Security Considerations

- All endpoints require JWT authentication
- User can only access their own shares unless they have admin permissions
- Share URLs are generated server-side to prevent tampering
- XP rewards are calculated server-side with platform-specific multipliers

## Future Enhancements

- **Analytics Dashboard**: Real-time sharing analytics and insights
- **Social Media Integration**: Direct posting to platforms via OAuth
- **Share Tracking**: Track clicks and engagement on shared content
- **Custom Share Templates**: User-defined share text templates
- **Share Scheduling**: Schedule shares for optimal engagement times
- **Referral System**: Bonus XP for shares that generate new user registrations
