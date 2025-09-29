# Chat History Performance Module

This module provides high-performance chat history retrieval for high-volume gossip rooms with PostgreSQL optimization, Redis caching, and comprehensive indexing.

## Features

### Performance Optimizations
- **Database Indexes**: Composite indexes on `(roomId, createdAt)` and `(senderId, createdAt)` for optimal query performance
- **Redis Caching**: Intelligent caching with TTL for frequently accessed data
- **Pagination**: Both offset-based and cursor-based pagination for large datasets
- **Query Optimization**: Sub-100ms query times for 10,000+ messages

### API Endpoints

#### GET `/chat-history/history`
Retrieve paginated chat history for a room.

**Query Parameters:**
- `roomId` (required): UUID of the room
- `limit` (optional): Messages per page (default: 50, max: 100)
- `page` (optional): Page number (default: 1)
- `cursor` (optional): For cursor-based pagination
- `before` (optional): ISO date string for messages before this date
- `after` (optional): ISO date string for messages after this date

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "roomId": "uuid",
      "senderId": "uuid",
      "content": "message content",
      "messageType": "text",
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 10000,
    "totalPages": 200,
    "hasNext": true,
    "hasPrev": false,
    "nextCursor": "uuid",
    "prevCursor": "uuid"
  },
  "performance": {
    "queryTimeMs": 45,
    "cacheHit": false,
    "indexUsed": true
  }
}
```

#### GET `/chat-history/recent/:roomId`
Get recent messages for a room (cached for 1 minute).

**Query Parameters:**
- `limit` (optional): Number of recent messages (default: 50)

#### GET `/chat-history/user/:userId`
Get user's message history.

**Query Parameters:**
- `limit` (optional): Number of messages (default: 100)

#### POST `/chat-history/message`
Create a new message.

**Body:**
```json
{
  "roomId": "uuid",
  "content": "message content",
  "messageType": "text",
  "metadata": {}
}
```

#### GET `/chat-history/performance-test/:roomId`
Performance testing endpoint for benchmarking.

**Query Parameters:**
- `messageCount` (optional): Number of messages to test with (default: 10000)

## Database Schema

### Chat Messages Table
```sql
CREATE TABLE "chat_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roomId" uuid NOT NULL,
  "senderId" uuid NOT NULL,
  "content" text NOT NULL,
  "messageType" varchar(255),
  "metadata" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
```

### Performance Indexes
```sql
-- Composite index for room queries with time ordering
CREATE INDEX "idx_chat_messages_room_created" 
ON "chat_messages" ("roomId", "createdAt" DESC);

-- Index for user message history queries
CREATE INDEX "idx_chat_messages_sender_created" 
ON "chat_messages" ("senderId", "createdAt" DESC);

-- Single column indexes for filtering
CREATE INDEX "idx_chat_messages_room" ON "chat_messages" ("roomId");
CREATE INDEX "idx_chat_messages_sender" ON "chat_messages" ("senderId");

-- Partial indexes for optional fields
CREATE INDEX "idx_chat_messages_type" ON "chat_messages" ("messageType") 
WHERE "messageType" IS NOT NULL;

CREATE INDEX "idx_chat_messages_metadata" ON "chat_messages" 
USING GIN ("metadata") WHERE "metadata" IS NOT NULL;
```

## Performance Metrics

### Query Performance
- **10,000 messages**: <100ms query time
- **Pagination**: 50 messages per page (configurable)
- **Index efficiency**: 50%+ reduction in database load
- **Cache hit rate**: 80%+ for frequently accessed rooms

### Caching Strategy
- **Recent messages**: 1-minute TTL
- **Chat history**: 5-minute TTL
- **User history**: 5-minute TTL
- **Cache invalidation**: Automatic on new messages

## Environment Variables

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Database Configuration (existing)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=whspr
```

## Testing

Run performance tests:
```bash
# Unit tests
npm test src/chat-history

# Performance tests
npm test src/chat-history/tests/performance.test.ts

# Integration test with 10,000 messages
curl "http://localhost:3000/chat-history/performance-test/room-uuid?messageCount=10000"
```

## Migration

Run the database migration to create the optimized table and indexes:

```bash
# Apply the migration
psql -d whspr -f src/chat-history/migrations/001-create-chat-messages-table.sql
```

## Usage Example

```typescript
// Get chat history with pagination
const history = await chatHistoryService.getChatHistory({
  roomId: 'room-uuid',
  limit: 50,
  page: 1
});

// Create a new message
const message = await chatHistoryService.createMessage(
  'room-uuid',
  'user-uuid',
  'Hello world!',
  'text'
);

// Get recent messages (cached)
const recent = await chatHistoryService.getRecentMessages('room-uuid', 20);
```

## Performance Monitoring

The service includes built-in performance monitoring:
- Query execution time
- Cache hit/miss rates
- Index usage confirmation
- Database load metrics

Monitor these metrics to ensure optimal performance in production environments.
