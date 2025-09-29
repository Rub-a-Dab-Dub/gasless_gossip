# Whisper API Documentation

This module provides comprehensive API documentation for the Whisper social platform using Swagger/OpenAPI 3.0.

## 📚 **API Documentation Features**

### **Interactive Documentation**
- **Swagger UI**: Interactive API explorer at `/api-docs`
- **Try It Out**: Test endpoints directly from the browser
- **Authentication**: Built-in JWT token support
- **Request/Response Examples**: Comprehensive examples for all endpoints

### **Comprehensive Coverage**
- **Authentication**: User registration and login
- **Gossip**: Real-time gossip intents and WebSocket events
- **Rooms**: Secret room creation and management
- **XP & Levels**: User experience and gamification
- **Wallet**: Multi-network balance management
- **Polls**: Room polls and voting system
- **Chat History**: Message history and performance
- **Rate Limiting**: Abuse prevention and monitoring
- **Error Handling**: Global error management
- **Token Gifts**: Gasless token gifting

## 🚀 **Getting Started**

### **Access Documentation**
```bash
# Start the development server
npm run start:dev

# Access API documentation
http://localhost:3001/api-docs
```

### **Authentication**
1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login`
3. **Copy JWT Token** from response
4. **Click "Authorize"** in Swagger UI
5. **Enter**: `Bearer <your-jwt-token>`

## 📋 **API Endpoints Overview**

### **🔐 Authentication**
```typescript
POST /auth/register          # Register new user
POST /auth/login             # User login
```

### **💬 Gossip (WebSocket)**
```typescript
WebSocket /gossip            # Real-time gossip events
├── authenticate             # Authenticate connection
├── join-room               # Join specific room
├── leave-room              # Leave room
├── new-gossip              # Create gossip intent
├── update-gossip           # Update gossip intent
├── vote-gossip             # Vote on gossip
└── comment-gossip          # Comment on gossip
```

### **🏠 Secret Rooms**
```typescript
POST /rooms/create          # Create secret room
GET  /rooms/:id             # Get room details
GET  /rooms/code/:code      # Get room by code
GET  /rooms/user/rooms      # Get user's rooms
POST /rooms/join            # Join room
POST /rooms/:id/leave       # Leave room
GET  /rooms/:id/members     # Get room members
POST /rooms/:id/invite      # Invite user to room
POST /rooms/invite/accept   # Accept invitation
PUT  /rooms/:id             # Update room
DELETE /rooms/:id           # Delete room
```

### **⭐ XP & Levels**
```typescript
POST /xp/add                # Add XP to user
GET  /xp/user/:id           # Get user XP
GET  /xp/user/:id/stats     # Get user stats
GET  /xp/leaderboard        # Get leaderboard
GET  /xp/admin/stats        # Admin statistics
```

### **💰 Wallet**
```typescript
GET  /wallet/balance/:userId    # Get user wallet balance
GET  /wallet/balance            # Get current user balance
POST /wallet/refresh            # Refresh balances
GET  /wallet/stats              # Wallet statistics
GET  /wallet/test/base-sepolia  # Test Base Sepolia
GET  /wallet/test/stellar-testnet # Test Stellar Testnet
GET  /wallet/test/performance   # Performance testing
```

### **🗳️ Polls**
```typescript
POST /polls                  # Create poll
POST /polls/vote            # Vote on poll
GET  /polls/:roomId         # Get room polls
```

### **💬 Chat History**
```typescript
GET  /chat-history/history      # Get chat history
GET  /chat-history/recent/:roomId # Get recent messages
GET  /chat-history/user/:userId # Get user messages
POST /chat-history/message     # Create message
GET  /chat-history/performance-test/:roomId # Performance test
```

### **🚦 Rate Limiting**
```typescript
GET  /rate-limit/stats         # Rate limit statistics
GET  /rate-limit/violations    # Get violations
POST /rate-limit/violation/:id/resolve # Resolve violation
```

### **🎁 Token Gifts**
```typescript
POST /gift/token               # Create token gift
GET  /gift/token/:giftId       # Get gift details
GET  /gift/token/user/:userId  # Get user gifts
POST /gift/token/estimate-gas  # Estimate gas costs
GET  /gift/token/paymaster-status/:network # Paymaster status
```

### **⚡ Error Handling**
```typescript
GET  /error-handling/stats     # Error statistics
GET  /error-handling/error/:id # Get error details
POST /error-handling/error/:id/resolve # Resolve error
```

## 🔧 **Configuration**

### **Swagger Setup**
```typescript
// src/swagger/swagger.module.ts
const config = new DocumentBuilder()
  .setTitle('Whisper API')
  .setDescription('Comprehensive API for Whisper social platform')
  .setVersion('1.0.0')
  .addBearerAuth() // JWT authentication
  .addTag('Authentication', 'User authentication')
  .addTag('Gossip', 'Real-time gossip system')
  .addTag('Rooms', 'Secret room management')
  .addTag('XP & Levels', 'Gamification system')
  .addTag('Wallet', 'Multi-network wallet')
  .build();
```

### **Main Application**
```typescript
// src/main.ts
import { SwaggerModule } from './swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup Swagger documentation
  SwaggerModule.setupSwagger(app);
  
  await app.listen(3001);
  console.log('API Documentation: http://localhost:3001/api-docs');
}
```

## 📖 **Usage Examples**

### **1. User Registration**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### **2. User Login**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

### **3. Create Secret Room**
```bash
curl -X POST http://localhost:3001/rooms/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "My Secret Room",
    "description": "A private room for gossip",
    "isPrivate": true,
    "maxUsers": 50,
    "category": "gossip",
    "theme": "dark"
  }'
```

### **4. Add XP to User**
```bash
curl -X POST http://localhost:3001/xp/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "userId": "user-123",
    "amount": 100,
    "type": "message",
    "source": "chat",
    "description": "Sent a message"
  }'
```

### **5. Get Wallet Balance**
```bash
curl -X GET "http://localhost:3001/wallet/balance/user-123?networks=base,stellar&assets=ETH,XLM,USDC" \
  -H "Authorization: Bearer <jwt-token>"
```

### **6. WebSocket Connection (Gossip)**
```javascript
// Client-side WebSocket connection
const socket = io('http://localhost:3001/gossip', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Authenticate
socket.emit('authenticate', { 
  token: 'your-jwt-token', 
  userId: 'user-123' 
});

// Join room
socket.emit('join-room', { roomId: 'room-123' });

// Create gossip intent
socket.emit('new-gossip', {
  roomId: 'room-123',
  content: 'This is some gossip!',
  category: 'rumor',
  tags: ['celebrity', 'scandal']
});
```

## 🎯 **Response Examples**

### **Authentication Response**
```json
{
  "id": "user-123",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### **Secret Room Response**
```json
{
  "id": "room-123",
  "creatorId": "user-123",
  "name": "My Secret Room",
  "description": "A private room for gossip",
  "roomCode": "SECRET123",
  "isPrivate": true,
  "isActive": true,
  "status": "active",
  "maxUsers": 50,
  "currentUsers": 1,
  "category": "gossip",
  "theme": "dark",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### **XP Response**
```json
{
  "id": "xp-transaction-123",
  "userId": "user-123",
  "amount": 100,
  "type": "message",
  "source": "chat",
  "description": "Sent a message",
  "previousXp": 500,
  "newXp": 600,
  "previousLevel": 2,
  "newLevel": 2,
  "levelUp": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### **Wallet Balance Response**
```json
{
  "userId": "user-123",
  "totalUsdValue": "2005.00",
  "networks": {
    "base": {
      "totalUsdValue": "2000.00",
      "assets": [
        {
          "id": "balance-1",
          "network": "base",
          "asset": "ETH",
          "symbol": "ETH",
          "balance": "1000000000000000000",
          "formattedBalance": "1.0",
          "usdValue": "2000.00",
          "assetType": "native",
          "walletAddress": "0x1234...",
          "lastFetchedAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    },
    "stellar": {
      "totalUsdValue": "5.00",
      "assets": [
        {
          "id": "balance-2",
          "network": "stellar",
          "asset": "XLM",
          "symbol": "XLM",
          "balance": "10000000",
          "formattedBalance": "10.0",
          "usdValue": "5.00",
          "assetType": "native",
          "walletAddress": "G1234...",
          "lastFetchedAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  },
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "cacheHit": false,
  "responseTime": 250
}
```

## 🔒 **Authentication**

### **JWT Token Usage**
1. **Login** to get JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Token expires** in 24 hours (configurable)
4. **Refresh token** by logging in again

### **Protected Endpoints**
- All endpoints except `/auth/register` and `/auth/login` require authentication
- Include `Authorization: Bearer <token>` header
- Invalid tokens return `401 Unauthorized`

## 📊 **Rate Limiting**

### **Default Limits**
- **Authentication**: 10 requests/minute
- **Room Creation**: 10 requests/minute
- **XP Addition**: 100 requests/minute
- **Wallet Balance**: 30 requests/minute
- **General API**: 100 requests/minute

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🚨 **Error Handling**

### **Common Error Responses**
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/rooms/create"
}
```

### **Error Types**
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource not found)
- **409**: Conflict (duplicate resource)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error

## 🧪 **Testing**

### **Test Endpoints**
```typescript
// Performance testing
GET /wallet/test/performance
GET /chat-history/performance-test/:roomId
GET /rooms/test/performance

// Network testing
GET /wallet/test/base-sepolia
GET /wallet/test/stellar-testnet

// Cache testing
GET /wallet/test/cache-performance
```

### **Load Testing**
```bash
# Test with multiple concurrent requests
for i in {1..10}; do
  curl -X GET "http://localhost:3001/wallet/balance/user-123" \
    -H "Authorization: Bearer <token>" &
done
wait
```

## 📱 **Mobile/Web Integration**

### **React Native Example**
```javascript
// API client setup
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token
apiClient.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
const createRoom = async (roomData) => {
  const response = await apiClient.post('/rooms/create', roomData);
  return response.data;
};
```

### **Web JavaScript Example**
```javascript
// Fetch API with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('jwt_token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Usage
const getWalletBalance = async (userId) => {
  const response = await fetchWithAuth(`/wallet/balance/${userId}`);
  return response.json();
};
```

## 🔧 **Development**

### **Adding New Endpoints**
1. **Add Swagger decorators** to controller methods
2. **Include API tags** for organization
3. **Add operation descriptions** and examples
4. **Document request/response schemas**
5. **Include error responses**

### **Example Controller Method**
```typescript
@Post('example')
@ApiOperation({ 
  summary: 'Example endpoint',
  description: 'This is an example endpoint with full documentation'
})
@ApiBody({ type: ExampleDto })
@ApiResponse({ 
  status: 200, 
  description: 'Success response',
  schema: { /* response schema */ }
})
@ApiResponse({ 
  status: 400, 
  description: 'Bad request',
  schema: { /* error schema */ }
})
async exampleMethod(@Body() dto: ExampleDto) {
  return this.service.exampleMethod(dto);
}
```

## 📈 **Performance**

### **Response Times**
- **Authentication**: < 200ms
- **Room Creation**: < 200ms
- **XP Operations**: < 200ms
- **Wallet Balance**: < 1s
- **WebSocket Events**: < 500ms

### **Caching**
- **Wallet Balances**: 60s TTL
- **Room Data**: 5min TTL
- **User Stats**: 10min TTL

## 🚀 **Deployment**

### **Production Configuration**
```typescript
// Update server URLs in Swagger config
.addServer('https://api.whisper.com', 'Production server')
.addServer('https://staging-api.whisper.com', 'Staging server')
```

### **Environment Variables**
```env
# API Documentation
SWAGGER_ENABLED=true
API_DOCS_PATH=/api-docs

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## 📚 **Additional Resources**

- **OpenAPI 3.0 Specification**: [https://swagger.io/specification/](https://swagger.io/specification/)
- **NestJS Swagger**: [https://docs.nestjs.com/openapi/introduction](https://docs.nestjs.com/openapi/introduction)
- **Swagger UI**: [https://swagger.io/tools/swagger-ui/](https://swagger.io/tools/swagger-ui/)

## 🎯 **Best Practices**

1. **Always include examples** in API responses
2. **Document all error cases** with proper status codes
3. **Use consistent naming** for endpoints and parameters
4. **Include authentication requirements** for protected endpoints
5. **Provide clear descriptions** for complex operations
6. **Test all endpoints** using the Swagger UI
7. **Keep documentation up-to-date** with code changes

The API documentation is now fully integrated and accessible at `/api-docs` with comprehensive coverage of all endpoints, authentication, examples, and testing capabilities for mobile and web developers.
