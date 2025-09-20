# Room Management System

This module implements a comprehensive room management system for the Whisper messaging app, allowing users to join and leave rooms with proper validation and XP integration.

## Features

### Core Functionality
- **Join Room**: Users can join rooms with proper validation
- **Leave Room**: Users can leave rooms (except owners)
- **Room Creation**: Create rooms with different types and requirements
- **Membership Management**: Track room memberships and roles
- **XP Integration**: Award XP for joining rooms based on room type

### Room Types
1. **Public** (`public`): Open to all users (5 XP on join)
2. **Private** (`private`): Restricted access (10 XP on join) 
3. **Invite Only** (`invite_only`): Requires invitation (15 XP on join)

### Member Roles
- **Owner**: Room creator, cannot leave without transferring ownership
- **Admin**: Can manage room settings and members
- **Member**: Regular room participant

## API Endpoints

### Room Management
```
POST /rooms                    # Create a new room
GET /rooms                     # Get all available rooms
GET /rooms/my-rooms           # Get user's joined rooms
GET /rooms/:roomId/members    # Get room members
```

### Membership Actions
```
POST /rooms/join              # Join a room
POST /rooms/leave             # Leave a room
```

### Request/Response Examples

#### Join Room
```typescript
// Request
POST /rooms/join
{
  "roomId": "550e8400-e29b-41d4-a716-446655440000"
}

// Response
{
  "success": true,
  "message": "Successfully joined room: General Chat",
  "xpAwarded": 5
}
```

#### Leave Room
```typescript
// Request
POST /rooms/leave
{
  "roomId": "550e8400-e29b-41d4-a716-446655440000"
}

// Response
{
  "success": true,
  "message": "Successfully left room: General Chat"
}
```

## Database Schema

### Rooms Table
```sql
CREATE TABLE rooms (
  id uuid PRIMARY KEY,
  name varchar(100) UNIQUE NOT NULL,
  description varchar(500),
  type room_type_enum DEFAULT 'public',
  max_members integer DEFAULT 100,
  created_by varchar(255) NOT NULL,
  is_active boolean DEFAULT true,
  min_level integer DEFAULT 1,
  min_xp integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Room Memberships Table
```sql
CREATE TABLE room_memberships (
  id uuid PRIMARY KEY,
  room_id uuid REFERENCES rooms(id),
  user_id varchar(255) NOT NULL,
  role membership_role_enum DEFAULT 'member',
  invited_by varchar(255),
  is_active boolean DEFAULT true,
  joined_at timestamptz DEFAULT now()
);
```

## Soroban Smart Contract Integration

The room system also includes Soroban smart contract functionality for on-chain room management:

### Contract Functions
- `create_room()`: Create a new room on-chain
- `join_room()`: Join a room with validation
- `leave_room()`: Leave a room
- `get_room()`: Get room information
- `is_member()`: Check membership status

### Events
- `MemberJoined`: Emitted when user joins room
- `MemberLeft`: Emitted when user leaves room  
- `RoomCreated`: Emitted when room is created

## Validation Rules

### Join Room Validation
1. Room must exist and be active
2. User cannot already be a member
3. Room cannot be at maximum capacity
4. User must meet minimum level/XP requirements
5. Room type specific access rules must be satisfied

### Leave Room Validation
1. Room must exist
2. User must be a current member
3. Room owners cannot leave (must transfer ownership first)

## XP Awards

Users receive XP when joining rooms:
- Public rooms: 5 XP
- Private rooms: 10 XP  
- Invite-only rooms: 15 XP

XP is awarded through the existing XP service and tracked for gamification purposes.

## WebSocket Integration

The room system integrates with the chat gateway to provide real-time notifications:

- `member_joined`: Broadcast when someone joins a room
- `member_left`: Broadcast when someone leaves a room
- Message validation: Only room members can send messages

## Error Handling

The system provides comprehensive error handling:
- `NotFoundException`: Room or user not found
- `BadRequestException`: Invalid operations (duplicate join, capacity full, etc.)
- `ForbiddenException`: Access denied (invite-only rooms)

## Future Enhancements

- Invitation system for invite-only rooms
- Room moderation tools
- Temporary room access (timed memberships)
- Room-specific permissions and settings
- Integration with reputation system for access control