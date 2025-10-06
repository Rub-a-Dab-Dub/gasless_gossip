# Pump Room API Documentation

## Overview
The Pump Room module manages prediction markets and voting systems with weighted voting, alpha verification, and reward distribution.

## Endpoints

### 1. Start Pump Room
**POST** `/pump-room`

Create a new pump room for predictions and voting.

**Request Body:**
\`\`\`json
{
  "roomName": "BTC Price Prediction Q1 2025",
  "description": "Predict Bitcoin price movements",
  "creatorId": "admin-001",
  "startTime": "2025-01-01T00:00:00Z",
  "endTime": "2025-03-31T23:59:59Z",
  "verificationRequired": true,
  "minAlphaScore": 50.0,
  "rewardPool": 10000.0
}
\`\`\`

### 2. Get Pump Rooms
**GET** `/pump-room?status=active&limit=50`

Retrieve pump rooms with optional filters.

### 3. Create Prediction
**POST** `/pump-room/predictions`

Submit a prediction to a pump room.

**Request Body:**
\`\`\`json
{
  "pumpRoomId": "pump-001",
  "userId": "user-001",
  "username": "CryptoWhale",
  "predictionText": "BTC will reach $150k",
  "targetPrice": 150000.0,
  "confidence": 85.0,
  "alphaScore": 92.5
}
\`\`\`

### 4. Create Vote
**POST** `/pump-room/votes`

Vote on a prediction with weighted voting.

**Request Body:**
\`\`\`json
{
  "pumpRoomId": "pump-001",
  "predictionId": "pred-001",
  "userId": "user-004",
  "username": "Voter1",
  "voteType": "upvote",
  "alphaScore": 85.0,
  "stakeAmount": 100.0
}
\`\`\`

### 5. Get Leaderboard
**GET** `/pump-room/:id/leaderboard`

Get real-time leaderboard with weighted scores (cached for 5 seconds).

### 6. Tally Results
**PUT** `/pump-room/:id/tally`

Admin endpoint to finalize outcomes and distribute rewards.

**Request Body:**
\`\`\`json
{
  "adminId": "admin-001",
  "outcomes": [
    { "predictionId": "pred-001", "outcome": "correct" },
    { "predictionId": "pred-002", "outcome": "incorrect" }
  ]
}
\`\`\`

### 7. Verify Alpha
**PUT** `/pump-room/predictions/:id/verify`

Admin endpoint to verify prediction alpha scores.

### 8. Pause/Cancel Pump
**DELETE** `/pump-room/:id/pause`
**DELETE** `/pump-room/:id/cancel`

Admin intervention to pause or cancel a pump room.

## Features

### Weighted Voting
- Vote weight = (alphaScore * 0.7) + (log10(stakeAmount) * 0.3)
- Prevents spam and rewards high-quality participants

### Alpha Verification
- Optional verification requirement for predictions
- Admin approval process for high-stakes rooms

### Reward Distribution
- Proportional to weighted vote scores
- Rank bonuses: 1st (50%), 2nd (25%), 3rd (10%)
- Automatic distribution on tally

### Real-time Leaderboard
- Redis-cached for 5-second updates
- Sorted by weighted vote scores
- Only shows verified predictions
