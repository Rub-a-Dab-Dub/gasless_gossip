use crate::types::{UserProfile, calculate_level};
use soroban_sdk::{
    contractimpl, Address, Env, String, Vec, contract, symbol_short,
    contracterror, contractevent, panic_with_error
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum RoomError {
    RoomNotFound = 1,
    UserAlreadyMember = 2,
    UserNotMember = 3,
    RoomCapacityFull = 4,
    InsufficientLevel = 5,
    InsufficientXp = 6,
    RoomNotActive = 7,
    InvalidRoomType = 8,
}

#[contractevent]
#[derive(Clone, Debug)]
pub struct MemberJoined {
    pub room_id: u128,
    pub user: Address,
    pub room_type: u32,
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
    pub room_type: u32,
}

#[derive(Clone, Debug, PartialEq)]
pub struct Room {
    pub id: u128,
    pub name: String,
    pub room_type: u32, // 1=Public, 2=Private, 3=InviteOnly
    pub max_members: u32,
    pub min_level: u32,
    pub min_xp: u64,
    pub creator: Address,
    pub members: Vec<Address>,
    pub is_active: bool,
    pub created_at: u64,
}

#[contract]
pub struct RoomManager;

#[contractimpl]
impl RoomManager {
    /// Create a new room
    pub fn create_room(
        env: &Env,
        creator: Address,
        room_id: u128,
        name: String,
        room_type: u32,
        max_members: u32,
        min_level: u32,
        min_xp: u64,
    ) -> Room {
        creator.require_auth();
        
        // Validate room type
        if room_type < 1 || room_type > 3 {
            panic_with_error!(env, RoomError::InvalidRoomType);
        }

        let room_key = (symbol_short!("room"), room_id);
        
        if env.storage().persistent().has(&room_key) {
            panic!("Room already exists");
        }

        let mut members = Vec::new(env);
        members.push_back(creator.clone());

        let room = Room {
            id: room_id,
            name: name.clone(),
            room_type,
            max_members,
            min_level,
            min_xp,
            creator: creator.clone(),
            members,
            is_active: true,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&room_key, &room);

        // Emit room creation event
        env.events().publish(
            (symbol_short!("room_created"),),
            RoomCreated {
                room_id,
                name: name.clone(),
                creator: creator.clone(),
                room_type,
            }
        );

        room
    }

    /// Join a room
    pub fn join_room(env: &Env, user: Address, room_id: u128) -> bool {
        user.require_auth();

        let room_key = (symbol_short!("room"), room_id);
        
        if !env.storage().persistent().has(&room_key) {
            panic_with_error!(env, RoomError::RoomNotFound);
        }

        let mut room: Room = env.storage().persistent().get(&room_key).unwrap();

        if !room.is_active {
            panic_with_error!(env, RoomError::RoomNotActive);
        }

        // Check if user is already a member
        for member in room.members.iter() {
            if member == user {
                panic_with_error!(env, RoomError::UserAlreadyMember);
            }
        }

        // Check capacity
        if room.members.len() >= room.max_members {
            panic_with_error!(env, RoomError::RoomCapacityFull);
        }

        // Check user requirements if user profile exists
        let user_key = (symbol_short!("usr"), user.clone());
        if env.storage().persistent().has(&user_key) {
            let user_profile: UserProfile = env.storage().persistent().get(&user_key).unwrap();
            
            if user_profile.level < room.min_level {
                panic_with_error!(env, RoomError::InsufficientLevel);
            }
            
            if user_profile.xp < room.min_xp {
                panic_with_error!(env, RoomError::InsufficientXp);
            }
        }

        // Add user to room
        room.members.push_back(user.clone());
        env.storage().persistent().set(&room_key, &room);

        // Award XP for joining room
        let xp_amount = match room.room_type {
            1 => 5,  // Public room
            2 => 10, // Private room
            3 => 15, // Invite-only room
            _ => 5,
        };

        // Add XP to user if profile exists
        if env.storage().persistent().has(&user_key) {
            let mut user_profile: UserProfile = env.storage().persistent().get(&user_key).unwrap();
            user_profile.xp += xp_amount;
            
            // Check for level up
            let new_level = calculate_level(user_profile.xp);
            if new_level != user_profile.level {
                user_profile.level = new_level;
            }
            
            env.storage().persistent().set(&user_key, &user_profile);
        }

        // Emit member joined event
        env.events().publish(
            (symbol_short!("member_joined"),),
            MemberJoined {
                room_id,
                user: user.clone(),
                room_type: room.room_type,
            }
        );

        true
    }

    /// Leave a room
    pub fn leave_room(env: &Env, user: Address, room_id: u128) -> bool {
        user.require_auth();

        let room_key = (symbol_short!("room"), room_id);
        
        if !env.storage().persistent().has(&room_key) {
            panic_with_error!(env, RoomError::RoomNotFound);
        }

        let mut room: Room = env.storage().persistent().get(&room_key).unwrap();

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

                // Emit member left event
                env.events().publish(
                    (symbol_short!("member_left"),),
                    MemberLeft {
                        room_id,
                        user: user.clone(),
                    }
                );

                true
            },
            None => panic_with_error!(env, RoomError::UserNotMember),
        }
    }

    /// Get room information
    pub fn get_room(env: &Env, room_id: u128) -> Room {
        let room_key = (symbol_short!("room"), room_id);
        
        if !env.storage().persistent().has(&room_key) {
            panic_with_error!(env, RoomError::RoomNotFound);
        }

        env.storage().persistent().get(&room_key).unwrap()
    }

    /// Check if user is a member of a room
    pub fn is_member(env: &Env, user: Address, room_id: u128) -> bool {
        let room_key = (symbol_short!("room"), room_id);
        
        if !env.storage().persistent().has(&room_key) {
            return false;
        }

        let room: Room = env.storage().persistent().get(&room_key).unwrap();
        
        for member in room.members.iter() {
            if member == user {
                return true;
            }
        }
        
        false
    }

    /// Get member count for a room
    pub fn get_member_count(env: &Env, room_id: u128) -> u32 {
        let room_key = (symbol_short!("room"), room_id);
        
        if !env.storage().persistent().has(&room_key) {
            return 0;
        }

        let room: Room = env.storage().persistent().get(&room_key).unwrap();
        room.members.len()
    }
}