#![cfg(test)]

use crate::rooms::rooms::{RoomManager, RoomManagerClient};
use crate::types::{calculate_level, RoomType, XpReason};
use crate::users::users::{UserManager, UserManagerClient};
use crate::{WhsprContract, WhsprContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env, Map, String};

// Helper function to setup test environment
fn setup_test_env() -> (Env, UserManagerClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn test_user_registration() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user
    client.register_user(&user_address, &username);

    // Get user profile
    let profile = client.get_user(&user_address);
    assert_eq!(profile.username, username);
    assert_eq!(profile.xp, 0);
    assert_eq!(profile.level, 1);
}

#[test]
fn test_xp_and_level_progression() {
    let (env, client) = setup_test_env();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user
    client.register_user(&user_address, &username);

    // Verify initial state
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 0);
    assert_eq!(profile.level, 1);

    // Test XP addition and automatic level up
    client.add_xp(&user_address, &50, &XpReason::DailyLogin);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 50);
    assert_eq!(profile.level, 1);

    // Add XP to trigger level up to level 2
    client.add_xp(&user_address, &60, &XpReason::DailyLogin); // Total: 110 XP
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 110);
    assert_eq!(profile.level, 2);

    // Test multiple level ups in one addition
    client.add_xp(&user_address, &500, &XpReason::DailyLogin); // Total: 610 XP
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 610);
    assert_eq!(profile.level, 4);

    // Test exact threshold values
    client.add_xp(&user_address, &390, &XpReason::DailyLogin); // Total: 1000 XP (Level 5 threshold)
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 1000);
    assert_eq!(profile.level, 5);

    // Test max level cap
    client.add_xp(&user_address, &6000, &XpReason::DailyLogin); // Total: 7000 XP (beyond Level 10)
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 7000);
    assert_eq!(profile.level, 10);
}

#[test]
fn test_manual_level_update() {
    let (env, client) = setup_test_env();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user and add XP
    client.register_user(&user_address, &username);
    client.add_xp(&user_address, &350, &XpReason::DailyLogin); // Should be Level 3

    // Verify level
    let profile = client.get_user(&user_address);
    assert_eq!(profile.level, 3);

    // Call manual update (should not change anything)
    client.update_user_level(&user_address);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.level, 3);
}

#[test]
fn test_calculate_level() {
    // Test level boundaries
    assert_eq!(calculate_level(0), 1); // Level 1: 0-99
    assert_eq!(calculate_level(50), 1); // Level 1: 0-99
    assert_eq!(calculate_level(99), 1); // Level 1: 0-99
    assert_eq!(calculate_level(100), 2); // Level 2: 100-299
    assert_eq!(calculate_level(299), 2); // Level 2: 100-299
    assert_eq!(calculate_level(300), 3); // Level 3: 300-599
    assert_eq!(calculate_level(550), 3); // Level 3: 300-599 (test case from requirements)
    assert_eq!(calculate_level(599), 3); // Level 3: 300-599
    assert_eq!(calculate_level(600), 4); // Level 4: 600-999
    assert_eq!(calculate_level(999), 4); // Level 4: 600-999
    assert_eq!(calculate_level(1000), 5); // Level 5: 1000-1499
    assert_eq!(calculate_level(1499), 5); // Level 5: 1000-1499
    assert_eq!(calculate_level(1500), 6); // Level 6: 1500-2199
    assert_eq!(calculate_level(2199), 6); // Level 6: 1500-2199
    assert_eq!(calculate_level(2200), 7); // Level 7: 2200-2999
    assert_eq!(calculate_level(2999), 7); // Level 7: 2200-2999
    assert_eq!(calculate_level(3000), 8); // Level 8: 3000-3999
    assert_eq!(calculate_level(3999), 8); // Level 8: 3000-3999
    assert_eq!(calculate_level(4000), 9); // Level 9: 4000-5199
    assert_eq!(calculate_level(5199), 9); // Level 9: 4000-5199
    assert_eq!(calculate_level(5200), 10); // Level 10: 5200+
    assert_eq!(calculate_level(6599), 10); // Level 10: 5200-6599
    assert_eq!(calculate_level(6600), 10); // Level 10 cap
    assert_eq!(calculate_level(9999), 10); // Beyond Level 10 cap
}

#[test]
fn test_update_user_level() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user
    client.register_user(&user_address, &username);

    // Add XP to level 3
    client.add_xp(&user_address, &400, &XpReason::DailyLogin); // 400 XP = Level 3
    let profile = client.get_user(&user_address);
    assert_eq!(profile.level, 3);

    // Call update_user_level (should not change anything since level is correct)
    client.update_user_level(&user_address);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.level, 3);
}

#[test]
fn test_xp_overflow_protection() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user
    client.register_user(&user_address, &username);

    // Add maximum XP to test overflow protection
    client.add_xp(&user_address, &u64::MAX, &XpReason::DailyLogin);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, u64::MAX);
    assert_eq!(profile.level, 10);

    // Try to add more XP (should saturate, not overflow)
    client.add_xp(&user_address, &100, &XpReason::DailyLogin);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, u64::MAX); // Should remain at max
    assert_eq!(profile.level, 10);
}

#[test]
fn test_edge_cases() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

    // Test exact threshold values
    assert_eq!(calculate_level(100), 2); // Exactly at level 2 threshold
    assert_eq!(calculate_level(300), 3); // Exactly at level 3 threshold
    assert_eq!(calculate_level(6600), 10); // Exactly at max level threshold
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_add_xp_unregistered_user() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

    let user_address = Address::generate(&env);

    // Try to add XP to unregistered user
    client.add_xp(&user_address, &100, &XpReason::DailyLogin);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_update_level_unregistered_user() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

    let user_address = Address::generate(&env);

    // Try to update level for unregistered user
    client.update_user_level(&user_address);
}

// === ROOM TESTS ===

// Helper function to setup room test environment
fn setup_room_test_env() -> (Env, RoomManagerClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(RoomManager, {});
    let client = RoomManagerClient::new(&env, &contract_id);
    (env, client)
}

// Helper function to setup full contract test environment
fn setup_full_contract_env() -> (Env, WhsprContractClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(WhsprContract, {});
    let client = WhsprContractClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn test_create_public_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Test Public Room");
    let settings = Map::new(&env);

    // Create a public room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // Verify room was created
    assert_eq!(room_id, 1); // First room should have ID 1

    // Get room details
    let room = client.get_room(&room_id);
    assert_eq!(room.id, room_id);
    assert_eq!(room.name, room_name);
    assert_eq!(room.creator, creator);
    assert_eq!(room.room_type, RoomType::Public);
    assert_eq!(room.members.len(), 1); // Creator is automatically added
    assert_eq!(room.members.get(0).unwrap(), creator);
    assert_eq!(room.is_active, true);
    assert_eq!(room.max_members, 100); // Default value
    assert_eq!(room.min_level, 1); // Default value
    assert_eq!(room.min_xp, 0); // Default value
}

#[test]
fn test_create_private_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Test Private Room");
    let settings = Map::new(&env);

    // Create a private room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Private, &settings);

    // Get room details
    let room = client.get_room(&room_id);
    assert_eq!(room.room_type, RoomType::Private);
    assert_eq!(room.creator, creator);
}

#[test]
fn test_create_secret_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Test Secret Room");
    let settings = Map::new(&env);

    // Create a secret room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Secret, &settings);

    // Get room details
    let room = client.get_room(&room_id);
    assert_eq!(room.room_type, RoomType::Secret);
    assert_eq!(room.creator, creator);
}

#[test]
fn test_create_room_with_custom_settings() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Custom Settings Room");

    // Create settings map
    let mut settings = Map::new(&env);
    settings.set(
        String::from_str(&env, "max_members"),
        String::from_str(&env, "50"),
    );
    settings.set(
        String::from_str(&env, "min_level"),
        String::from_str(&env, "3"),
    );
    settings.set(
        String::from_str(&env, "min_xp"),
        String::from_str(&env, "500"),
    );
    settings.set(
        String::from_str(&env, "description"),
        String::from_str(&env, "A custom room"),
    );

    // Create room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // Get room details
    let room = client.get_room(&room_id);
    assert_eq!(room.settings.len(), 4);
    assert_eq!(
        room.settings
            .get(String::from_str(&env, "description"))
            .unwrap(),
        String::from_str(&env, "A custom room")
    );
}

#[test]
fn test_multiple_room_creation() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    // Create multiple rooms
    let room1_id = client.create_room(
        &creator,
        &String::from_str(&env, "Room 1"),
        &RoomType::Public,
        &settings,
    );
    let room2_id = client.create_room(
        &creator,
        &String::from_str(&env, "Room 2"),
        &RoomType::Private,
        &settings,
    );
    let room3_id = client.create_room(
        &creator,
        &String::from_str(&env, "Room 3"),
        &RoomType::Secret,
        &settings,
    );

    // Verify unique IDs
    assert_eq!(room1_id, 1);
    assert_eq!(room2_id, 2);
    assert_eq!(room3_id, 3);

    // Verify rooms exist
    let room1 = client.get_room(&room1_id);
    let room2 = client.get_room(&room2_id);
    let room3 = client.get_room(&room3_id);

    assert_eq!(room1.name, String::from_str(&env, "Room 1"));
    assert_eq!(room2.name, String::from_str(&env, "Room 2"));
    assert_eq!(room3.name, String::from_str(&env, "Room 3"));
}

#[test]
fn test_join_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let room_name = String::from_str(&env, "Join Test Room");
    let settings = Map::new(&env);

    // Create room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // User joins room
    let result = client.join_room(&user, &room_id);
    assert_eq!(result, true);

    // Verify user is member
    assert_eq!(client.is_member(&user, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 2); // Creator + User

    // Get room and check members
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 2);
    assert_eq!(room.members.get(1).unwrap(), user);
}

#[test]
fn test_leave_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let room_name = String::from_str(&env, "Leave Test Room");
    let settings = Map::new(&env);

    // Create room and join
    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);
    client.join_room(&user, &room_id);

    // Verify user is member
    assert_eq!(client.is_member(&user, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 2);

    // User leaves room
    let result = client.leave_room(&user, &room_id);
    assert_eq!(result, true);

    // Verify user is no longer member
    assert_eq!(client.is_member(&user, &room_id), false);
    assert_eq!(client.get_member_count(&room_id), 1); // Only creator remains
}

#[test]
fn test_update_room_settings() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Settings Test Room");
    let settings = Map::new(&env);

    // Create room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // Update settings
    let mut new_settings = Map::new(&env);
    new_settings.set(
        String::from_str(&env, "description"),
        String::from_str(&env, "Updated description"),
    );
    new_settings.set(
        String::from_str(&env, "theme"),
        String::from_str(&env, "dark"),
    );

    let result = client.update_room_settings(&creator, &room_id, &new_settings);
    assert_eq!(result, true);

    // Verify settings were updated
    let room = client.get_room(&room_id);
    assert_eq!(room.settings.len(), 2);
    assert_eq!(
        room.settings
            .get(String::from_str(&env, "description"))
            .unwrap(),
        String::from_str(&env, "Updated description")
    );
}

#[test]
fn test_deactivate_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Deactivate Test Room");
    let settings = Map::new(&env);

    // Create room
    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // Verify room is active
    let room = client.get_room(&room_id);
    assert_eq!(room.is_active, true);

    // Deactivate room
    let result = client.deactivate_room(&creator, &room_id);
    assert_eq!(result, true);

    // Verify room is deactivated
    let room = client.get_room(&room_id);
    assert_eq!(room.is_active, false);
}

#[test]
fn test_full_contract_integration() {
    let (env, client) = setup_full_contract_env();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    // Register users using the user management functions directly
    // Note: The integration might need adjustment based on how the modules are connected

    // Create room through main contract
    let settings = Map::new(&env);
    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Integration Test"),
        &RoomType::Public,
        &settings,
    );

    // Join room
    let join_result = client.join_room(&user, &room_id);
    assert_eq!(join_result, true);

    // Check membership
    assert_eq!(client.is_member(&user, &room_id), true);

    // Get room details
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 2);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_get_nonexistent_room() {
    let (env, client) = setup_room_test_env();

    // Try to get a room that doesn't exist
    client.get_room(&999);
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn test_join_room_already_member() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    // Create room
    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Test Room"),
        &RoomType::Public,
        &settings,
    );

    // User joins room
    client.join_room(&user, &room_id);

    // Try to join again (should panic)
    client.join_room(&user, &room_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #7)")]
fn test_leave_room_not_member() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    // Create room
    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Test Room"),
        &RoomType::Public,
        &settings,
    );

    // Try to leave without being a member (should panic)
    client.leave_room(&user, &room_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #11)")]
fn test_join_inactive_room() {
    let (env, client) = setup_room_test_env();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    // Create room
    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Test Room"),
        &RoomType::Public,
        &settings,
    );

    // Deactivate room
    client.deactivate_room(&creator, &room_id);

    // Try to join inactive room (should panic)
    client.join_room(&user, &room_id);
}

#[test]
fn test_add_xp_with_reason_and_history() {
    let (env, client) = setup_test_env();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    client.register_user(&user_address, &username);

    // Add XP for message sent
    client.add_xp(&user_address, &50, &XpReason::MessageSent);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 50);
    assert_eq!(profile.xp_history.len(), 1);

    // Add XP for custom reason
    client.add_xp(
        &user_address,
        &25,
        &XpReason::Custom(String::from_str(&env, "SpecialEvent")),
    );
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 75);
    assert_eq!(profile.xp_history.len(), 2);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn test_add_xp_invalid_amount_should_panic() {
    let (env, client) = setup_test_env();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    client.register_user(&user_address, &username);

    // Try to add 0 XP (should panic)
    client.add_xp(&user_address, &0, &XpReason::DailyLogin);
}
