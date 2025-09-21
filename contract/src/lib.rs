#![no_std]

pub mod users;
pub mod rooms;
pub mod types;

use soroban_sdk::{contract, contractimpl, Address, Env, String, Map};
use types::{RoomType, Room, UserProfile};
use users::users::UserManager;
use rooms::rooms::RoomManager;

#[contract]
pub struct WhsprContract;

#[contractimpl]
impl WhsprContract {
    // User Management Functions
    pub fn register_user(env: Env, account_id: Address, username: String) {
        UserManager::register_user(&env, account_id, username);
    }

    pub fn add_xp(env: Env, account_id: Address, xp_amount: u64, reason: String) {
        UserManager::add_xp(&env, account_id, xp_amount, types::XpReason::Custom(reason));
    }

    pub fn get_user(env: Env, account_id: Address) -> UserProfile {
        UserManager::get_user(&env, account_id)
    }

    // Room Management Functions
    pub fn create_room(
        env: Env,
        creator: Address,
        name: String,
        room_type: RoomType,
        settings: Map<String, String>,
    ) -> u128 {
        RoomManager::create_room(&env, creator, name, room_type, settings)
    }

    pub fn join_room(env: Env, user: Address, room_id: u128) -> bool {
        RoomManager::join_room(&env, user, room_id)
    }

    pub fn leave_room(env: Env, user: Address, room_id: u128) -> bool {
        RoomManager::leave_room(&env, user, room_id)
    }

    pub fn get_room(env: Env, room_id: u128) -> Room {
        RoomManager::get_room(&env, room_id)
    }

    pub fn is_member(env: Env, user: Address, room_id: u128) -> bool {
        RoomManager::is_member(&env, user, room_id)
    }

    pub fn get_member_count(env: Env, room_id: u128) -> u32 {
        RoomManager::get_member_count(&env, room_id)
    }

    pub fn update_room_settings(
        env: Env,
        creator: Address,
        room_id: u128,
        settings: Map<String, String>,
    ) -> bool {
        RoomManager::update_room_settings(&env, creator, room_id, settings)
    }

    pub fn deactivate_room(env: Env, creator: Address, room_id: u128) -> bool {
        RoomManager::deactivate_room(&env, creator, room_id)
    }
}

#[cfg(test)]
mod test;
