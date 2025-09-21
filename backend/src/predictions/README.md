# PredictionsModule

A comprehensive prediction and voting system for Pump Rooms, allowing users to make predictions about future events and earn rewards for accurate predictions via Stellar blockchain integration.

## 🎯 Features

- **Create Predictions**: Users can create predictions about future events in specific rooms
- **Vote on Predictions**: Community members can vote on whether predictions will come true
- **Reward System**: Accurate predictors and correct voters receive Stellar tokens as rewards
- **Real-time Statistics**: Live vote counting and prediction analytics
- **Authentication**: Secure endpoints requiring user authentication
- **Database Integration**: PostgreSQL for reliable data storage and retrieval

## 📋 API Endpoints

### Create Prediction
```
POST /predictions
```
**Body:**
```json
{
  "roomId": "uuid",
  "title": "Prediction Title",
  "description": "Optional description",
  "prediction": "Detailed prediction text",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Vote on Prediction
```
POST /predictions/vote
```
**Body:**
```json
{
  "predictionId": "uuid",
  "isCorrect": true
}
```

### Resolve Prediction
```
POST /predictions/resolve
```
**Body:**
```json
{
  "predictionId": "uuid",
  "isCorrect": true
}
```

### Get Predictions by Room
```
GET /predictions/room/:roomId?status=active
```

### Get Prediction by ID
```
GET /predictions/:id
```

### Get User Predictions
```
GET /predictions/user/my-predictions
```

## 🗄️ Database Schema

### Predictions Table
```sql
CREATE TABLE predictions (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    prediction VARCHAR(200) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    outcome VARCHAR(20) DEFAULT 'pending',
    vote_count INTEGER DEFAULT 0,
    correct_votes INTEGER DEFAULT 0,
    incorrect_votes INTEGER DEFAULT 0,
    reward_pool DECIMAL(18,7) DEFAULT 0,
    reward_per_correct_vote DECIMAL(18,7) DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Prediction Votes Table
```sql
CREATE TABLE prediction_votes (
    id UUID PRIMARY KEY,
    prediction_id UUID NOT NULL,
    user_id UUID NOT NULL,
    is_correct BOOLEAN NOT NULL,
    reward_amount DECIMAL(18,7) DEFAULT 0,
    reward_claimed BOOLEAN DEFAULT FALSE,
    tx_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(prediction_id, user_id)
);
```

## 🎁 Reward System

### How Rewards Work
1. **Prediction Creation**: Users create predictions with expiration dates
2. **Community Voting**: Other users vote on whether predictions will come true
3. **Resolution**: Prediction creators resolve predictions as correct/incorrect
4. **Reward Distribution**: Correct voters automatically receive Stellar tokens

### Reward Calculation
- **Base Reward**: 10 tokens per correct vote
- **Distribution**: Automatic via Stellar blockchain
- **Tracking**: Transaction IDs stored for transparency
- **Claiming**: Rewards are automatically distributed (no manual claiming needed)

## 🔧 Technical Implementation

### Entities
- **Prediction**: Main prediction entity with metadata and statistics
- **PredictionVote**: Individual votes on predictions with reward tracking

### Services
- **PredictionsService**: Core business logic for predictions and voting
- **StellarService**: Integration with Stellar blockchain for token distribution

### DTOs
- **CreatePredictionDto**: Validation for creating new predictions
- **VotePredictionDto**: Validation for voting on predictions
- **ResolvePredictionDto**: Validation for resolving predictions

### Key Features
- **Transaction Safety**: Database transactions ensure data consistency
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Validation**: Input validation using class-validator decorators
- **Logging**: Detailed logging for debugging and monitoring

## 🧪 Testing

### Unit Tests
- Comprehensive test coverage for PredictionsService
- Mock implementations for external dependencies
- Edge case testing for error scenarios

### E2E Tests
- Full API endpoint testing
- Database integration testing
- Authentication flow testing

### Test Commands
```bash
# Run unit tests
npm test predictions.service.spec.ts

# Run e2e tests
npm run test:e2e predictions.e2e-spec.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- PostgreSQL database
- Stellar network access (testnet for development)

### Installation
1. The PredictionsModule is automatically loaded by the application
2. Run the database migration to create required tables:
   ```bash
   npm run migrate
   ```
3. Start the application:
   ```bash
   npm run start:dev
   ```

### Environment Variables
Ensure these environment variables are set:
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## 🔒 Security Features

- **Authentication Required**: All endpoints require valid JWT tokens
- **Input Validation**: Comprehensive validation using class-validator
- **SQL Injection Prevention**: Using TypeORM parameterized queries
- **Authorization**: Users can only resolve their own predictions
- **Rate Limiting**: Built-in protection against spam (via NestJS guards)

## 📊 Monitoring and Analytics

### Logging
- Prediction creation events
- Vote submission events
- Reward distribution events
- Error tracking and debugging

### Metrics
- Vote counts per prediction
- Correct vs incorrect vote ratios
- Reward distribution statistics
- User engagement metrics

## 🔮 Future Enhancements

- **Prediction Categories**: Categorize predictions by type
- **Time-based Rewards**: Different reward amounts based on prediction timeframe
- **Community Moderation**: Allow community to flag inappropriate predictions
- **Prediction Analytics**: Advanced analytics and reporting
- **Mobile Notifications**: Real-time notifications for prediction updates
- **Prediction Templates**: Pre-defined prediction templates for common scenarios

## 🤝 Contributing

1. Follow the existing code patterns and conventions
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure all linting rules pass
5. Test database migrations thoroughly

## 📝 License

This module is part of the Whspr Stellar project and follows the same licensing terms.

---

**Community Notes**: "Predict the future! Share ideas in discussions." 🌟

The PredictionsModule enables users to make informed predictions about future events and earn rewards for accuracy, creating an engaging community-driven prediction market within Pump Rooms.
