use crate::types::{calculate_level, DataKey, Room, RoomType, UserProfile};
use crate::error::{Error, handle_error};
use soroban_sdk::{
    contract, contractevent, contractimpl, symbol_short, Address,
    Env, Map, String, Vec,log
};

#[contractevent]
#[derive(Clone, Debug)]
pub struct MemberJoined {
    pub room_id: u128,
    pub user: Address,
    pub room_type: RoomType,
}

#[contractevent]
#[derive(Clone, Debug)]
pub struct MemberLeft {
    pub room_id: u128,
    pub user: Address,
}

#[contractevent]
#[derive(Clone, Debug)]
pub struct RoomCreated {
    pub room_id: u128,
    pub name: String,
    pub creator: Address,
    pub room_type: RoomType,
}

#[contract]
pub struct RoomManager;

#[contractimpl]
impl RoomManager {
    /// Create a new room
    pub fn create_room(
        env: &Env,
        creator: Address,
        name: String,
        room_type: RoomType,
        settings: Map<String, String>,
    ) -> Result<u128, Error> {
        creator.require_auth();

        // Generate unique room ID
        let next_id_key = DataKey::NextRoomId;
        let room_id: u128 = env.storage().persistent().get(&next_id_key).unwrap_or(1);
        env.storage().persistent().set(&next_id_key, &(room_id + 1));

        let room_key = DataKey::Room(room_id);

        if env.storage().persistent().has(&room_key) {
            return Err(Error::RoomAlreadyExists);
        }

        // Validate room name uniqueness (if required)
        // This is optional based on your requirements

        // Get settings or use defaults - convert strings manually
        let max_members_key = String::from_str(env, "max_members");
        let max_members = if settings.contains_key(max_members_key) {
            // Convert string to number manually since soroban String doesn't have parse()
            // For now, use default values or implement custom parsing if needed
            100 // Default max members
        } else {
            100
        };

        let min_level_key = String::from_str(env, "min_level");
        let min_level = if settings.contains_key(min_level_key) {
            1 // Default min level
        } else {
            1
        };

        let min_xp_key = String::from_str(env, "min_xp");
        let min_xp = if settings.contains_key(min_xp_key) {
            0 // Default min XP
        } else {
            0
        };

        let mut members = Vec::new(env);
        members.push_back(creator.clone());

        let room = Room {
            id: room_id,
            creator: creator.clone(),
            room_type: room_type.clone(),
            name: name.clone(),
            members,
            settings: settings.clone(),
            max_members,
            min_level,
            min_xp,
            is_active: true,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&room_key, &room);

        // TODO: Add proper event emission when Soroban SDK supports it better
        // For now, we'll skip events to focus on core functionality

        Ok(room_id)
    }

    /// Join a room
    pub fn join_room(env: &Env, user: Address, room_id: u128) ->  Result<bool, Error> {
        user.require_auth();

        log!(&env, "Joining room: user={:?}, room_id={}", user, room_id);

        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Err(Error::RoomNotFound);
        }

        let mut room: Room = match env.storage().persistent().get(&room_key) {
        Some(r) => r,
        None => {
            log!(&env, "Storage error: failed to retrieve room for room_id={}", room_id);
            handle_error(&env, Error::StorageError)
            }
        };

        if !room.is_active {
            return Err(Error::RoomNotActive);
        }

        // Check if user is already a member
        for member in room.members.iter() {
            if member == user {
                return Err(Error::UserAlreadyMember);
            }
        }

        // Check capacity
        if room.members.len() >= room.max_members {
            return Err(Error::RoomCapacityFull);
        }

        // Check user requirements if user profile exists
        let user_key = (symbol_short!("usr"), user.clone());
        if env.storage().persistent().has(&user_key) {
            let user_profile: UserProfile = match env.storage().persistent().get(&user_key) {
            Some(p) => p,
            None => {
                log!(&env, "Storage error: failed to retrieve profile for user={:?}", user);
                handle_error(env, Error::StorageError);
                }
            };

            if user_profile.level < room.min_level {
                return Err(Error::InsufficientLevel);
            }

            if user_profile.xp < room.min_xp {
                return Err(Error::InsufficientXp);
            }
        }

        // Add user to room
        room.members.push_back(user.clone());
        env.storage().persistent().set(&room_key, &room);

        // Award XP for joining room
        let xp_amount = match room.room_type {
            RoomType::Public => 5,
            RoomType::Private => 10,
            RoomType::Secret => 15,
        };

        // Add XP to user if profile exists
        if env.storage().persistent().has(&user_key) {
            let mut user_profile: UserProfile = match env.storage().persistent().get(&user_key) {
            Some(p) => p,
            None => {
                log!(&env, "Storage error: failed to retrieve profile for user={:?}", user);
                handle_error(env, Error::StorageError);
            }
        };
            user_profile.xp += xp_amount;

            // Check for level up
            let new_level = calculate_level(user_profile.xp);
            if new_level != user_profile.level {
                user_profile.level = new_level;
            }

            env.storage().persistent().set(&user_key, &user_profile);
        }

        // TODO: Add proper event emission when Soroban SDK supports it better

        Ok(true)
    }

    /// Leave a room
    pub fn leave_room(env: &Env, user: Address, room_id: u128) ->  Result<bool, Error> {
        user.require_auth();

        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Err(Error::RoomNotFound);
        }

        
        let mut room: Room = match env.storage().persistent().get(&room_key) {
        Some(r) => r,
        None => {
            log!(&env, "Storage error: failed to retrieve room for room_id={}", room_id);
            handle_error(env, Error::StorageError);
            }
        };

        // Find and remove user from members
        let mut user_index = None;
        for (i, member) in room.members.iter().enumerate() {
            if member == user {
                user_index = Some(i);
                break;
            }
        }

        match user_index {
            Some(index) => {
                room.members.remove(index as u32);
                env.storage().persistent().set(&room_key, &room);

                // TODO: Add proper event emission when Soroban SDK supports it better

                Ok(true)
            }
             None => return Err(Error::UserNotMember)
        }
    }

    /// Get room information
    pub fn get_room(env: &Env, room_id: u128) ->  Result<Room, Error> {
        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Err(Error::RoomNotFound)
        }

        env.storage().persistent().get(&room_key).unwrap()
    }

    /// Check if user is a member of a room
    pub fn is_member(env: &Env, user: Address, room_id: u128) ->  Result<bool, Error> {
        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Ok(false);
        }

        let room: Room = env.storage().persistent().get(&room_key).unwrap();

        for member in room.members.iter() {
            if member == user {
                return Ok(true);
            }
        }

        Ok(false)
    }

    /// Get member count for a room
    pub fn get_member_count(env: &Env, room_id: u128) ->  Result<u32, Error> {
        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Ok(0);
        }

        let room: Room = env.storage().persistent().get(&room_key).unwrap();
        Ok(room.members.len())
    }

    /// Update room settings
    pub fn update_room_settings(
        env: &Env,
        creator: Address,
        room_id: u128,
        settings: Map<String, String>,
    ) -> Result<bool, Error>  {
        creator.require_auth();

        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Err(Error::RoomNotFound)
        }

        let mut room: Room = match env.storage().persistent().get(&room_key) {
        Some(r) => r,
        None => {
            log!(&env, "Storage error: failed to retrieve room for room_id={}", room_id);
            handle_error(env, Error::StorageError);
            }
        };

        // Only creator can update settings
        if room.creator != creator {
            return Err(Error::OnlyRoomCreatorCanUpdate)
        }

        // Update settings
        room.settings = settings.clone();

        // Update derived settings - use simple approach since parsing is complex in Soroban
        let max_members_key = String::from_str(env, "max_members");
        if settings.contains_key(max_members_key) {
            // For now, keep existing value or set a reasonable default
            // In a real implementation, you might want to implement custom parsing
            room.max_members = 100; // Could be made configurable
        }

        let min_level_key = String::from_str(env, "min_level");
        if settings.contains_key(min_level_key) {
            room.min_level = 1; // Could be made configurable
        }

        let min_xp_key = String::from_str(env, "min_xp");
        if settings.contains_key(min_xp_key) {
            room.min_xp = 0; // Could be made configurable
        }
        // Example: If you want to log the creator as a string for auditing (not required for contract logic)
        // let creator_str: String = creator.to_string();
        // env.events().publish((symbol_short!("settings_update"),), creator_str);
        env.storage().persistent().set(&room_key, &room);

        Ok(true)
    }

    /// Deactivate a room (only creator can do this)
    pub fn deactivate_room(env: &Env, creator: Address, room_id: u128) -> Result<bool, Error>  {
        creator.require_auth();

        let room_key = DataKey::Room(room_id);

        if !env.storage().persistent().has(&room_key) {
            return Err(Error::RoomNotFound)
        }

        let mut room: Room = match env.storage().persistent().get(&room_key) {
        Some(r) => r,
        None => {
            log!(&env, "Storage error: failed to retrieve room for room_id={}", room_id);
            handle_error(env, Error::StorageError);
            }
        };

        // Only creator can deactivate
        if room.creator != creator {
            return Err(Error::OnlyRoomCreatorCanDeactivate)
        }

        room.is_active = false;
        env.storage().persistent().set(&room_key, &room);

        Ok(true)
    }
}
