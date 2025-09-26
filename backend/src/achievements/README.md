# AchievementsModule

The AchievementsModule provides a comprehensive gamification system for Whisper, allowing users to earn achievements for various milestones and receive Stellar token rewards.

## Features

- **Achievement Types**: Support for 10 different achievement types (messages sent, rooms joined, predictions made, etc.)
- **Tier System**: 5-tier achievement system (Bronze, Silver, Gold, Platinum, Diamond)
- **Stellar Integration**: Automatic token rewards distributed via Stellar blockchain
- **PostgreSQL Storage**: Persistent achievement tracking with proper indexing
- **RESTful API**: Complete CRUD operations for achievements
- **Comprehensive Testing**: Unit tests, integration tests, and mock user action scenarios

## Achievement Types

| Type | Bronze | Silver | Gold | Platinum | Diamond |
|------|--------|--------|------|----------|---------|
| Messages Sent | 10 | 50 | 100 | 500 | 1000 |
| Rooms Joined | 5 | 25 | 50 | 100 | 250 |
| Predictions Made | 5 | 25 | 50 | 100 | 200 |
| Bets Placed | 5 | 25 | 50 | 100 | 200 |
| Gambles Played | 5 | 25 | 50 | 100 | 200 |
| Trades Completed | 5 | 25 | 50 | 100 | 200 |
| Visits Made | 10 | 50 | 100 | 500 | 1000 |
| Level Reached | 5 | 10 | 20 | 30 | 50 |
| Streak Days | 3 | 7 | 14 | 30 | 60 |
| Tokens Earned | 100 | 500 | 1000 | 5000 | 10000 |

## Reward System

| Tier | Token Reward |
|------|--------------|
| Bronze | 10 tokens |
| Silver | 25 tokens |
| Gold | 50 tokens |
| Platinum | 100 tokens |
| Diamond | 250 tokens |

## API Endpoints

### GET /achievements/:userId
Get all achievements for a specific user.

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "messages_sent",
    "tier": "bronze",
    "milestoneValue": 10,
    "rewardAmount": 10,
    "stellarTransactionHash": "tx_hash",
    "isClaimed": false,
    "awardedAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST /achievements/award
Manually award an achievement to a user.

**Request Body:**
```json
{
  "userId": "uuid",
  "type": "messages_sent",
  "tier": "bronze",
  "milestoneValue": 10,
  "rewardAmount": 10
}
```

### POST /achievements/check-milestones
Check if a user has reached new milestones and award achievements automatically.

**Request Body:**
```json
{
  "userId": "uuid",
  "type": "messages_sent",
  "currentValue": 50
}
```

### GET /achievements/:userId/stats
Get achievement statistics for a user.

**Response:**
```json
{
  "totalAchievements": 5,
  "totalRewards": 150,
  "achievementsByType": {
    "messages_sent": 2,
    "rooms_joined": 1,
    "predictions_made": 1,
    "bets_placed": 1,
    "gambles_played": 0,
    "trades_completed": 0,
    "visits_made": 0,
    "level_reached": 0,
    "streak_days": 0,
    "tokens_earned": 0
  },
  "achievementsByTier": {
    "bronze": 2,
    "silver": 2,
    "gold": 1,
    "platinum": 0,
    "diamond": 0
  }
}
```

### GET /achievements/types/available
Get all available achievement types and their thresholds.

**Response:**
```json
{
  "messages_sent": [10, 50, 100, 500, 1000],
  "rooms_joined": [5, 25, 50, 100, 250],
  "predictions_made": [5, 25, 50, 100, 200],
  "bets_placed": [5, 25, 50, 100, 200],
  "gambles_played": [5, 25, 50, 100, 200],
  "trades_completed": [5, 25, 50, 100, 200],
  "visits_made": [10, 50, 100, 500, 1000],
  "level_reached": [5, 10, 20, 30, 50],
  "streak_days": [3, 7, 14, 30, 60],
  "tokens_earned": [100, 500, 1000, 5000, 10000]
}
```

## Usage Examples

### Awarding Achievements for User Actions

```typescript
// When a user sends a message
await achievementsService.checkAndAwardMilestones({
  userId: 'user-123',
  type: AchievementType.MESSAGES_SENT,
  currentValue: 10 // User has sent 10 messages
});

// When a user joins a room
await achievementsService.checkAndAwardMilestones({
  userId: 'user-123',
  type: AchievementType.ROOMS_JOINED,
  currentValue: 5 // User has joined 5 rooms
});
```

### Manual Achievement Awarding

```typescript
// Award a specific achievement
await achievementsService.awardAchievement({
  userId: 'user-123',
  type: AchievementType.LEVEL_REACHED,
  tier: AchievementTier.GOLD,
  milestoneValue: 20,
  rewardAmount: 50
});
```

### Getting User Statistics

```typescript
// Get user achievement statistics
const stats = await achievementsService.getUserAchievementStats('user-123');
console.log(`User has ${stats.totalAchievements} achievements worth ${stats.totalRewards} tokens`);
```

## Database Schema

The achievements table includes:
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `type`: Achievement type enum
- `tier`: Achievement tier enum
- `milestone_value`: The milestone value that triggered the achievement
- `reward_amount`: Token reward amount
- `stellar_transaction_hash`: Blockchain transaction hash
- `is_claimed`: Whether the reward has been claimed
- `awarded_at`: Timestamp when achievement was awarded

## Integration with Other Modules

The AchievementsModule integrates with:
- **UsersModule**: For user validation and relationships
- **StellarService**: For token reward distribution
- **Event System**: Can emit events when achievements are awarded

## Testing

The module includes comprehensive tests:
- Unit tests for service methods
- Controller tests for API endpoints
- Integration tests with mock user actions
- Database migration tests

Run tests with:
```bash
npm test -- achievements
```

## Future Enhancements

- Achievement badges/visual representations
- Achievement leaderboards
- Time-based achievements (daily/weekly/monthly)
- Achievement sharing and social features
- Custom achievement creation by users
- Achievement categories and collections
