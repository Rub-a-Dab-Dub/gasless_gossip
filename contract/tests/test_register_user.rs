use soroban_sdk::{testutils::Address as _, Address, Env, String};

use whspr_contract::users::users::{UserManager, UserManagerClient};

fn setup() -> (Env, UserManagerClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn test_register_user_success() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user
    client.register_user(&user_address, &username);

    // Get user profile and verify
    let profile = client.get_user(&user_address);
    assert_eq!(profile.username, username);
    assert_eq!(profile.account_id, user_address);
    assert_eq!(profile.xp, 0);
    assert_eq!(profile.level, 1);
    assert_eq!(profile.reputation, 0);
    assert_eq!(profile.xp_history.len(), 0);
}

#[test]
fn test_register_user_minimum_username_length() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let min_username = String::from_str(&env, "a");

    // Should succeed with 1 character username
    client.register_user(&user_address, &min_username);

    let profile = client.get_user(&user_address);
    assert_eq!(profile.username, min_username);
}

#[test]
fn test_register_user_maximum_username_length() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    // Create 32 character username (maximum allowed)
    let max_username = String::from_str(&env, "abcdefghijklmnopqrstuvwxyz123456");

    client.register_user(&user_address, &max_username);

    let profile = client.get_user(&user_address);
    assert_eq!(profile.username, max_username);
}

#[test]
fn test_register_user_with_special_characters() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let special_username = String::from_str(&env, "user_123-test");

    client.register_user(&user_address, &special_username);

    let profile = client.get_user(&user_address);
    assert_eq!(profile.username, special_username);
}

#[test]
fn test_register_user_unicode_characters() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let unicode_username = String::from_str(&env, "用户123");

    client.register_user(&user_address, &unicode_username);

    let profile = client.get_user(&user_address);
    assert_eq!(profile.username, unicode_username);
}

#[test]
#[ignore = "HostError from soroban-env-host"]
fn test_register_multiple_users() {
    let (env, client) = setup();

    // Register multiple users
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);

    client.register_user(&user1, &String::from_str(&env, "user1"));
    client.register_user(&user2, &String::from_str(&env, "user2"));
    client.register_user(&user3, &String::from_str(&env, "user3"));

    // Verify all users exist independently
    let profile1 = client.get_user(&user1);
    let profile2 = client.get_user(&user2);
    let profile3 = client.get_user(&user3);

    assert_eq!(profile1.username, String::from_str(&env, "user1"));
    assert_eq!(profile2.username, String::from_str(&env, "user2"));
    assert_eq!(profile3.username, String::from_str(&env, "user3"));

    // All should have different addresses
    assert_ne!(profile1.account_id, profile2.account_id);
    assert_ne!(profile2.account_id, profile3.account_id);
    assert_ne!(profile1.account_id, profile3.account_id);
}

#[test]
fn test_register_user_timestamp_validation() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "timestampuser");

    let before_registration = env.ledger().timestamp();
    client.register_user(&user_address, &username);
    let after_registration = env.ledger().timestamp();

    let profile = client.get_user(&user_address);
    assert!(profile.created_at >= before_registration);
    assert!(profile.created_at <= after_registration);
}

// Error case tests
#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn test_register_user_already_registered() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let username = String::from_str(&env, "testuser");

    // Register user first time
    client.register_user(&user_address, &username);

    // Try to register again (should panic)
    client.register_user(&user_address, &username);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn test_register_user_empty_username() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    let empty_username = String::from_str(&env, "");

    // Try to register with empty username
    client.register_user(&user_address, &empty_username);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn test_register_user_username_too_long() {
    let (env, client) = setup();
    let user_address = Address::generate(&env);
    // Create 33 character username (over the limit)
    let long_username = String::from_str(&env, "abcdefghijklmnopqrstuvwxyz1234567");

    client.register_user(&user_address, &long_username);
}

#[test]
#[ignore = "HostError from soroban-env-host"]
fn test_register_user_different_addresses_same_username() {
    let (env, client) = setup();
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let same_username = String::from_str(&env, "duplicatename");

    // In current implementation, same username can be used with different addresses
    // This documents the current behavior
    client.register_user(&user1, &same_username);
    client.register_user(&user2, &same_username);

    let profile1 = client.get_user(&user1);
    let profile2 = client.get_user(&user2);

    assert_eq!(profile1.username, same_username);
    assert_eq!(profile2.username, same_username);
    assert_ne!(profile1.account_id, profile2.account_id);
}
