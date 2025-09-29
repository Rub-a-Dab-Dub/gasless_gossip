# Gossip WebSocket Module

Real-time gossip updates using WebSockets for mobile/web clients with high-performance connection management and sub-500ms latency.

## Features

### Real-time Updates
- **WebSocket Gateway**: High-performance WebSocket server with namespace `/gossip`
- **User Authentication**: JWT-based authentication for secure connections
- **Room Management**: Join/leave rooms for targeted broadcasts
- **Event Broadcasting**: Real-time updates for gossip intents, votes, comments, and status changes

### Performance Optimizations
- **Connection Tracking**: Efficient user and room subscription management
- **Performance Monitoring**: Built-in latency and connection metrics
- **Memory Management**: Automatic cleanup of disconnected clients
- **Scalable Architecture**: Handles 100+ concurrent connections

### Database Schema
- **Gossip Intents**: Store gossip content with voting and status tracking
- **Gossip Updates**: Track all changes and interactions
- **Optimized Indexes**: Composite indexes for fast queries
- **JSON Metadata**: Flexible metadata storage

## WebSocket Events

### Client → Server Events

#### `authenticate`
Authenticate user and establish connection.
```javascript
socket.emit('authenticate', {
  token: 'jwt-token',
  userId: 'user-uuid'
});
```

#### `join_room`
Join a room to receive gossip updates.
```javascript
socket.emit('join_room', {
  roomId: 'room-uuid'
});
```

#### `leave_room`
Leave a room to stop receiving updates.
```javascript
socket.emit('leave_room', {
  roomId: 'room-uuid'
});
```

#### `new_gossip`
Create a new gossip intent.
```javascript
socket.emit('new_gossip', {
  roomId: 'room-uuid',
  content: 'Gossip content',
  metadata: { source: 'anonymous' },
  expiresInMinutes: 60
});
```

#### `update_gossip`
Update gossip status (admin only).
```javascript
socket.emit('update_gossip', {
  intentId: 'intent-uuid',
  status: 'verified', // 'pending', 'verified', 'debunked', 'expired'
  reason: 'Verified by admin'
});
```

#### `vote_gossip`
Vote on gossip intent.
```javascript
socket.emit('vote_gossip', {
  intentId: 'intent-uuid',
  action: 'upvote' // 'upvote', 'downvote', 'remove'
});
```

#### `comment_gossip`
Add comment to gossip intent.
```javascript
socket.emit('comment_gossip', {
  intentId: 'intent-uuid',
  content: 'Comment content'
});
```

### Server → Client Events

#### `gossip_update`
Real-time gossip updates broadcast to room subscribers.
```javascript
socket.on('gossip_update', (data) => {
  console.log('Gossip update:', data);
  // {
  //   type: 'new_intent' | 'status_change' | 'vote' | 'comment' | 'verification',
  //   intent: { ... },
  //   update: { ... }, // optional
  //   timestamp: '2024-01-01T00:00:00Z',
  //   roomId: 'room-uuid'
  // }
});
```

## API Usage

### Client Connection
```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000/gossip', {
  transports: ['websocket', 'polling']
});

// Authenticate
socket.emit('authenticate', {
  token: 'your-jwt-token',
  userId: 'your-user-id'
});

// Join room
socket.emit('join_room', { roomId: 'room-123' });

// Listen for updates
socket.on('gossip_update', (data) => {
  console.log('New gossip update:', data);
});

// Create gossip
socket.emit('new_gossip', {
  roomId: 'room-123',
  content: 'This is some juicy gossip!',
  expiresInMinutes: 60
});
```

### Server-side Broadcasting
```typescript
// Broadcast to room
await gossipGateway.broadcastToRoom('room-123', 'gossip_update', {
  type: 'new_intent',
  intent: gossipIntent,
  timestamp: new Date().toISOString(),
  roomId: 'room-123'
});

// Broadcast to specific user
await gossipGateway.broadcastToUser('user-123', 'notification', {
  message: 'Your gossip was verified!'
});

// Broadcast to all connected clients
await gossipGateway.broadcastToAll('system_message', {
  message: 'Server maintenance in 5 minutes'
});
```

## Performance Metrics

### Connection Statistics
```typescript
const stats = gossipGateway.getConnectionStats();
console.log({
  activeConnections: stats.activeConnections,
  totalConnections: stats.totalConnections,
  roomsSubscribed: stats.roomsSubscribed,
  usersConnected: stats.usersConnected,
  averageLatency: stats.averageLatency
});
```

### Performance Targets
- **Latency**: <500ms for all operations
- **Concurrent Connections**: 100+ users without crashing
- **Memory Usage**: Efficient cleanup of disconnected clients
- **Throughput**: 1000+ messages per second

## Database Schema

### Gossip Intents Table
```sql
CREATE TABLE "gossip_intents" (
  "id" uuid PRIMARY KEY,
  "roomId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "content" text NOT NULL,
  "status" varchar(20) DEFAULT 'pending',
  "metadata" jsonb,
  "upvotes" integer DEFAULT 0,
  "downvotes" integer DEFAULT 0,
  "expiresAt" timestamptz,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
```

### Gossip Updates Table
```sql
CREATE TABLE "gossip_updates" (
  "id" uuid PRIMARY KEY,
  "intentId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "type" varchar(20) NOT NULL,
  "content" text,
  "metadata" jsonb,
  "createdAt" timestamptz DEFAULT now()
);
```

## Testing

### Unit Tests
```bash
npm test src/gossip/tests/gossip.gateway.spec.ts
```

### Performance Tests
```bash
npm test src/gossip/tests/performance.test.ts
```

### Load Testing
```bash
# Test with 100 concurrent clients
npm run test:performance:gossip
```

## Environment Configuration

```env
# WebSocket Configuration
WS_PORT=3000
WS_CORS_ORIGIN=*

# Database (existing)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=whspr

# JWT (existing)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
```

## Migration

Run the database migration to create the gossip tables:

```bash
psql -d whspr -f src/gossip/migrations/001-create-gossip-tables.sql
```

## Monitoring

The gateway includes built-in performance monitoring:
- Connection tracking
- Latency measurement
- Memory usage monitoring
- Error rate tracking

Monitor these metrics to ensure optimal performance in production.

## Security

- **Authentication**: JWT token validation for all operations
- **Authorization**: Room access control
- **Rate Limiting**: Built-in protection against spam
- **Input Validation**: All inputs are validated and sanitized

## Troubleshooting

### Common Issues

1. **Connection Drops**: Check network stability and WebSocket transport settings
2. **High Latency**: Monitor database performance and index usage
3. **Memory Leaks**: Ensure proper client disconnection handling
4. **Authentication Failures**: Verify JWT token validity and expiration

### Debug Mode
```typescript
// Enable debug logging
const gateway = new GossipGateway();
gateway.logger.setLogLevels(['debug', 'log', 'warn', 'error']);
```
