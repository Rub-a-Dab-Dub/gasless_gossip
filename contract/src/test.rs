#![cfg(test)]

use crate::users::users::{UserManager, UserManagerClient};
use crate::types::calculate_level;
use soroban_sdk::{testutils::Address as _, Env, String, Address};


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
    client.add_xp(&user_address, &50);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 50);
    assert_eq!(profile.level, 1);
    
    // Add XP to trigger level up to level 2
    client.add_xp(&user_address, &60);  // Total: 110 XP
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 110);
    assert_eq!(profile.level, 2);
    
    // Test multiple level ups in one addition
    client.add_xp(&user_address, &500);  // Total: 610 XP
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 610);
    assert_eq!(profile.level, 4);
    
    // Test exact threshold values
    client.add_xp(&user_address, &390);  // Total: 1000 XP (Level 5 threshold)
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, 1000);
    assert_eq!(profile.level, 5);
    
    // Test max level cap
    client.add_xp(&user_address, &6000);  // Total: 7000 XP (beyond Level 10)
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
    client.add_xp(&user_address, &350);  // Should be Level 3
    
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
    assert_eq!(calculate_level(0), 1);      // Level 1: 0-99
    assert_eq!(calculate_level(50), 1);     // Level 1: 0-99
    assert_eq!(calculate_level(99), 1);     // Level 1: 0-99
    assert_eq!(calculate_level(100), 2);    // Level 2: 100-299
    assert_eq!(calculate_level(299), 2);    // Level 2: 100-299
    assert_eq!(calculate_level(300), 3);    // Level 3: 300-599
    assert_eq!(calculate_level(550), 3);    // Level 3: 300-599 (test case from requirements)
    assert_eq!(calculate_level(599), 3);    // Level 3: 300-599
    assert_eq!(calculate_level(600), 4);    // Level 4: 600-999
    assert_eq!(calculate_level(999), 4);    // Level 4: 600-999
    assert_eq!(calculate_level(1000), 5);   // Level 5: 1000-1499
    assert_eq!(calculate_level(1499), 5);   // Level 5: 1000-1499
    assert_eq!(calculate_level(1500), 6);   // Level 6: 1500-2199
    assert_eq!(calculate_level(2199), 6);   // Level 6: 1500-2199
    assert_eq!(calculate_level(2200), 7);   // Level 7: 2200-2999
    assert_eq!(calculate_level(2999), 7);   // Level 7: 2200-2999
    assert_eq!(calculate_level(3000), 8);   // Level 8: 3000-3999
    assert_eq!(calculate_level(3999), 8);   // Level 8: 3000-3999
    assert_eq!(calculate_level(4000), 9);   // Level 9: 4000-5199
    assert_eq!(calculate_level(5199), 9);   // Level 9: 4000-5199
    assert_eq!(calculate_level(5200), 10);  // Level 10: 5200+
    assert_eq!(calculate_level(6599), 10);  // Level 10: 5200-6599
    assert_eq!(calculate_level(6600), 10);  // Level 10 cap
    assert_eq!(calculate_level(9999), 10);  // Beyond Level 10 cap
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
    client.add_xp(&user_address, &400); // 400 XP = Level 3
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
    client.add_xp(&user_address, &u64::MAX);
    let profile = client.get_user(&user_address);
    assert_eq!(profile.xp, u64::MAX);
    assert_eq!(profile.level, 10);
    
    // Try to add more XP (should saturate, not overflow)
    client.add_xp(&user_address, &100);
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
    assert_eq!(calculate_level(100), 2);   // Exactly at level 2 threshold
    assert_eq!(calculate_level(300), 3);   // Exactly at level 3 threshold
    assert_eq!(calculate_level(6600), 10); // Exactly at max level threshold
}

#[test]
#[should_panic(expected = "User not registered")]
fn test_add_xp_unregistered_user() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);
    
    let user_address = Address::generate(&env);
    
    // Try to add XP to unregistered user
    client.add_xp(&user_address, &100);
}

#[test]
#[should_panic(expected = "User not registered")]
fn test_update_level_unregistered_user() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);
    
    let user_address = Address::generate(&env);
    
    // Try to update level for unregistered user
    client.update_user_level(&user_address);
}
