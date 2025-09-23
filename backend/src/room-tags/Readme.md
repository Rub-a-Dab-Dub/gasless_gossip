```typescript
// API Usage Examples

// 1. Create a single tag
POST /room-tags
{
  "roomId": "550e8400-e29b-41d4-a716-446655440000",
  "tagName": "gossip"
}

Response:
{
  "id": "tag-id-1",
  "roomId": "550e8400-e29b-41d4-a716-446655440000",
  "tagName": "gossip",
  "createdBy": "user-1",
  "createdAt": "2024-01-15T10:30:00Z"
}

// 2. Create multiple tags at once
POST /room-tags/bulk
{
  "roomId": "550e8400-e29b-41d4-a716-446655440000",
  "tagNames": ["gossip", "degen", "crypto"]
}

Response:
[
  {
    "id": "tag-id-1",
    "roomId": "550e8400-e29b-41d4-a716-446655440000",
    "tagName": "gossip",
    "createdBy": "user-1",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  // ... more tags
]

// 3. Search rooms by single tag
GET /room-tags/search/gossip?limit=10&offset=0

Response:
{
  "rooms": [
    {
      "id": "room-id-1",
      "name": "Secret Gossip Room",
      "description": "Share the latest gossip",
      "type": "private",
      "tags": ["gossip", "secret", "chat"],
      "memberCount": 15,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "total": 1
}

// 4. Search rooms by multiple tags
POST /room-tags/search
{
  "tags": ["gossip", "degen"],
  "operator": "OR",
  "limit": 20,
  "offset": 0
}

Response:
{
  "rooms": [
    // Rooms matching either "gossip" OR "degen" tags
  ],
  "total": 5
}

// 5. Get popular tags
GET /room-tags/popular?limit=10

Response:
[
  {
    "tagName": "gossip",
    "roomCount": 25
  },
  {
    "tagName": "degen",
    "roomCount": 18
  },
  {
    "tagName": "crypto",
    "roomCount": 15
  }
]

// 6. Get all tags for a specific room
GET /room-tags/room/550e8400-e29b-41d4-a716-446655440000

Response:
[
  {
    "id": "tag-id-1",
    "roomId": "550e8400-e29b-41d4-a716-446655440000",
    "tagName": "gossip",
    "createdBy": "user-1",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]

// 7. Delete a tag
DELETE /room-tags
{
  "roomId": "550e8400-e29b-41d4-a716-446655440000",
  "tagName": "gossip"
}

Response: 204 No Content
```

## Database Indexes for Performance

```sql
-- Additional indexes for optimal performance
CREATE INDEX CONCURRENTLY idx_room_tags_created_at ON room_tags(created_at);
CREATE INDEX CONCURRENTLY idx_room_tags_created_by ON room_tags(created_by);
CREATE INDEX CONCURRENTLY idx_room_tags_room_id_created_at ON room_tags(room_id, created_at);

-- Composite index for tag popularity queries
CREATE INDEX CONCURRENTLY idx_room_tags_tag_name_room_active 
ON room_tags(tag_name) 
WHERE EXISTS (
    SELECT 1 FROM rooms r 
    WHERE r.id = room_tags.room_id 
    AND r.is_active = true
);
```

This comprehensive RoomTagsModule implementation provides:

✅ **Complete CRUD operations** for room tags
✅ **PostgreSQL storage** with optimized indexes
✅ **Creator privilege enforcement** (only room creators, owners, and admins can manage tags)
✅ **Efficient tag searching** with single and multiple tag support
✅ **Popular tags discovery** endpoint
✅ **Comprehensive validation** with DTOs
✅ **Full test coverage** with unit and integration tests
✅ **Performance optimized** queries with proper indexing  