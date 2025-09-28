# Intent Gossip Module

This module implements the Intent Gossip Endpoint for Multichain Broadcasting feature.

## Features

- Broadcast user intents (chat messages, trade offers, etc.) to Anoma's intent gossip network
- Support for multichain dissemination (Base, Stellar)
- Gasless gossip feature for Whisper
- Logging of broadcast events to PostgreSQL

## API Endpoint

### Broadcast Intent

```
POST /api/gossip/intents
```

#### Request Body

```json
{
  "type": "string",
  "payload": any,
  "chains": ["string"]
}
```

#### Example Request

```json
{
  "type": "chat_message",
  "payload": {
    "roomId": "room-123",
    "message": "Hello, world!"
  },
  "chains": ["base", "stellar"]
}
```

#### Response

```json
{
  "success": true,
  "message": "Intent broadcast successfully"
}
```

## Implementation Details

### Services

- `IntentGossipService`: Handles the broadcasting of intents and logging

### Controllers

- `GossipController`: Exposes the REST endpoint for broadcasting intents

### Entities

- `IntentLog`: Stores broadcast events in the database

### DTOs

- `BroadcastIntentDto`: Validates the request payload

## Database

The module creates an `intent_logs` table to store broadcast events with the following schema:

- `id`: UUID (Primary Key)
- `type`: VARCHAR - The type of intent being broadcast
- `payload`: JSONB - The intent payload
- `chains`: JSONB - The chains the intent was broadcast to
- `user_id`: UUID (Foreign Key) - Reference to the user who broadcast the intent
- `created_at`: TIMESTAMP - When the intent was broadcast

## Testing

Unit tests are provided for both the service and controller with >80% coverage.