use soroban_sdk::{testutils::Address as _, Address, Env, String};
use whspr_contract::users::users::{UserManager, UserManagerClient};
use whspr_contract::types::XpReason;

fn setup() -> (Env, UserManagerClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);
    (env, client)
}

fn create_registered_user(env: &Env, client: &UserManagerClient, username: &str) -> Address {
    let user_address = Address::generate(env);
    let username_str = String::from_str(env, username);
    client.register_user(&user_address, &username_str);
    user_address
}

#[test]
fn test_add_xp_level_progression() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "leveluser");

    // Add XP to trigger level up from 1 to 2
    client.add_xp(&user, &100, &XpReason::RoomCreated);

    let profile = client.get_user(&user);
    assert_eq!(profile.xp, 100);
    assert_eq!(profile.level, 2); // Should be level 2 now

    // Add more XP to trigger another level up
    client.add_xp(&user, &250, &XpReason::InviteAccepted); // Total: 350 XP

    let updated_profile = client.get_user(&user);
    assert_eq!(updated_profile.xp, 350);
    assert_eq!(updated_profile.level, 3); // Should be level 3 now
}

#[test]
fn test_add_xp_multiple_additions() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "multiuser");

    // Add XP multiple times
    client.add_xp(&user, &25, &XpReason::MessageSent);
    client.add_xp(&user, &30, &XpReason::DailyLogin);
    client.add_xp(&user, &45, &XpReason::Custom(String::from_str(&env, "Achievement")));

    let profile = client.get_user(&user);
    assert_eq!(profile.xp, 100); // 25 + 30 + 45
    assert_eq!(profile.level, 2); // 100 XP should be level 2
    assert_eq!(profile.xp_history.len(), 3);

    // Verify history order
    assert_eq!(profile.xp_history.get(0).unwrap().amount, 25);
    assert_eq!(profile.xp_history.get(1).unwrap().amount, 30);
    assert_eq!(profile.xp_history.get(2).unwrap().amount, 45);
}

#[test]
fn test_add_xp_all_reason_types() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "reasonuser");

    // Test all XP reason variants
    client.add_xp(&user, &10, &XpReason::MessageSent);
    client.add_xp(&user, &20, &XpReason::RoomCreated);
    client.add_xp(&user, &15, &XpReason::InviteAccepted);
    client.add_xp(&user, &5, &XpReason::DailyLogin);
    client.add_xp(&user, &25, &XpReason::Custom(String::from_str(&env, "Special Event")));

    let profile = client.get_user(&user);
    assert_eq!(profile.xp, 75);
    assert_eq!(profile.xp_history.len(), 5);

    // Verify each reason type is recorded correctly
    let history = &profile.xp_history;
    assert_eq!(history.get(0).unwrap().reason, XpReason::MessageSent);
    assert_eq!(history.get(1).unwrap().reason, XpReason::RoomCreated);
    assert_eq!(history.get(2).unwrap().reason, XpReason::InviteAccepted);
    assert_eq!(history.get(3).unwrap().reason, XpReason::DailyLogin);
    assert_eq!(history.get(4).unwrap().reason, XpReason::Custom(String::from_str(&env, "Special Event")));
}

#[test]
fn test_add_xp_large_amounts() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "biguser");

    // Add large amount of XP
    client.add_xp(&user, &5000, &XpReason::Custom(String::from_str(&env, "Mega Bonus")));

    let profile = client.get_user(&user);
    assert_eq!(profile.xp, 5000);
    assert_eq!(profile.level, 9); // 5000 XP should be level 9
}

#[test]
fn test_add_xp_overflow_protection() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "overflowuser");

    // Add maximum possible XP
    client.add_xp(&user, &u64::MAX, &XpReason::Custom(String::from_str(&env, "Max XP")));

    let profile = client.get_user(&user);
    assert_eq!(profile.xp, u64::MAX);
    assert_eq!(profile.level, 10); // Should cap at level 10

    // Try to add more (should saturate, not overflow)
    client.add_xp(&user, &100, &XpReason::DailyLogin);

    let updated_profile = client.get_user(&user);
    assert_eq!(updated_profile.xp, u64::MAX); // Should remain at max
    assert_eq!(updated_profile.level, 10);
}

#[test]
fn test_add_xp_timestamp_progression() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "timeuser");

    let start_time = env.ledger().timestamp();

    client.add_xp(&user, &50, &XpReason::MessageSent);

    // Simulate time passing (this is mock, but we can verify timestamps are reasonable)
    client.add_xp(&user, &30, &XpReason::DailyLogin);

    let profile = client.get_user(&user);
    let first_entry = profile.xp_history.get(0).unwrap();
    let second_entry = profile.xp_history.get(1).unwrap();

    assert!(first_entry.timestamp >= start_time);
    assert!(second_entry.timestamp >= first_entry.timestamp);
}

#[test]
fn test_add_xp_level_boundary_values() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "boundaryuser");

    // Test exact level boundary values
    client.add_xp(&user, &99, &XpReason::MessageSent); // Still level 1
    let profile = client.get_user(&user);
    assert_eq!(profile.level, 1);

    client.add_xp(&user, &1, &XpReason::DailyLogin); // Now level 2 (100 XP total)
    let updated_profile = client.get_user(&user);
    assert_eq!(updated_profile.xp, 100);
    assert_eq!(updated_profile.level, 2);
}

#[test]
fn test_add_xp_custom_reasons() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "customuser");

    // Test various custom reasons
    let custom_reasons = [
        "Achievement Unlocked",
        "Weekly Bonus",
        "Event Participation",
        "Bug Report",
        "Community Contribution",
    ];

    for (i, reason_text) in custom_reasons.iter().enumerate() {
        let amount = (i + 1) as u64 * 10;
        client.add_xp(&user, &amount, &XpReason::Custom(String::from_str(&env, reason_text)));
    }

    let profile = client.get_user(&user);
    assert_eq!(profile.xp, 150); // 10 + 20 + 30 + 40 + 50
    assert_eq!(profile.xp_history.len(), 5);

    // Verify custom reasons are preserved
    for (i, reason_text) in custom_reasons.iter().enumerate() {
        let entry = profile.xp_history.get(i as u32).unwrap();
        assert_eq!(entry.reason, XpReason::Custom(String::from_str(&env, reason_text)));
    }
}

// Error case tests
#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn test_add_xp_zero_amount() {
    let (env, client) = setup();
    let user = create_registered_user(&env, &client, "zerouser");

    // Try to add 0 XP (should panic)
    client.add_xp(&user, &0, &XpReason::MessageSent);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_add_xp_unregistered_user() {
    let (env, client) = setup();
    let unregistered_user = Address::generate(&env);

    // Try to add XP to unregistered user (should panic)
    client.add_xp(&unregistered_user, &100, &XpReason::MessageSent);
}
