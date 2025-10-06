"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prediction_entity_1 = require("./entities/prediction.entity");
console.log('🎯 PredictionsModule Demo');
console.log('========================\n');
console.log('1. Creating a Prediction:');
const createPredictionDto = {
    roomId: 'room-123',
    title: 'Bitcoin Price Prediction',
    description: 'Will Bitcoin reach $100,000 by end of 2024?',
    prediction: 'Bitcoin will reach $100,000 by December 31, 2024',
    expiresAt: '2024-12-31T23:59:59Z'
};
console.log('✅ Prediction DTO created:', createPredictionDto);
console.log('');
console.log('2. Voting on a Prediction:');
const votePredictionDto = {
    predictionId: 'prediction-456',
    isCorrect: true
};
console.log('✅ Vote DTO created:', votePredictionDto);
console.log('');
console.log('3. Resolving a Prediction:');
const resolvePredictionDto = {
    predictionId: 'prediction-456',
    isCorrect: true
};
console.log('✅ Resolution DTO created:', resolvePredictionDto);
console.log('');
console.log('4. Prediction Statuses and Outcomes:');
console.log('Available Statuses:', Object.values(prediction_entity_1.PredictionStatus));
console.log('Available Outcomes:', Object.values(prediction_entity_1.PredictionOutcome));
console.log('');
console.log('5. Available API Endpoints:');
console.log('📝 POST /predictions - Create a new prediction');
console.log('🗳️  POST /predictions/vote - Vote on a prediction');
console.log('✅ POST /predictions/resolve - Resolve a prediction');
console.log('📊 GET /predictions/room/:roomId - Get predictions by room');
console.log('🔍 GET /predictions/:id - Get prediction by ID');
console.log('👤 GET /predictions/user/my-predictions - Get user predictions');
console.log('');
console.log('6. Database Schema:');
console.log('📋 predictions table:');
console.log('   - id (UUID, Primary Key)');
console.log('   - roomId (UUID, Foreign Key to rooms)');
console.log('   - userId (UUID, Foreign Key to users)');
console.log('   - title (VARCHAR(500))');
console.log('   - description (TEXT)');
console.log('   - prediction (VARCHAR(200))');
console.log('   - expiresAt (TIMESTAMP)');
console.log('   - status (ENUM: active, resolved, cancelled)');
console.log('   - outcome (ENUM: correct, incorrect, pending)');
console.log('   - voteCount (INTEGER)');
console.log('   - correctVotes (INTEGER)');
console.log('   - incorrectVotes (INTEGER)');
console.log('   - rewardPool (DECIMAL)');
console.log('   - rewardPerCorrectVote (DECIMAL)');
console.log('   - isResolved (BOOLEAN)');
console.log('   - resolvedAt (TIMESTAMP)');
console.log('   - createdAt (TIMESTAMP)');
console.log('   - updatedAt (TIMESTAMP)');
console.log('');
console.log('📋 prediction_votes table:');
console.log('   - id (UUID, Primary Key)');
console.log('   - predictionId (UUID, Foreign Key to predictions)');
console.log('   - userId (UUID, Foreign Key to users)');
console.log('   - isCorrect (BOOLEAN)');
console.log('   - rewardAmount (DECIMAL)');
console.log('   - rewardClaimed (BOOLEAN)');
console.log('   - txId (VARCHAR)');
console.log('   - createdAt (TIMESTAMP)');
console.log('   - UNIQUE constraint on (predictionId, userId)');
console.log('');
console.log('7. Reward System:');
console.log('🎁 When a prediction is resolved:');
console.log('   - Correct voters receive tokens via Stellar');
console.log('   - Base reward: 10 tokens per correct vote');
console.log('   - Rewards are distributed automatically');
console.log('   - Transaction IDs are tracked for transparency');
console.log('');
console.log('8. Key Features:');
console.log('🔒 Authentication required for all endpoints');
console.log('⏰ Predictions have expiration dates');
console.log('🗳️  One vote per user per prediction');
console.log('👑 Only prediction creators can resolve predictions');
console.log('📊 Real-time vote counting and statistics');
console.log('🌟 Stellar integration for token rewards');
console.log('💾 PostgreSQL for reliable data storage');
console.log('🧪 Comprehensive test coverage');
console.log('');
console.log('🎉 PredictionsModule is ready for Pump Rooms!');
console.log('   Users can now predict the future and earn rewards! 🌟');
//# sourceMappingURL=demo.js.map