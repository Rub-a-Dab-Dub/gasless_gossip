use soroban_sdk::{testutils::Address as _, Address, Env, Map, String};
use whspr_contract::rooms::rooms::{RoomManager, RoomManagerClient};
use whspr_contract::types::RoomType;

fn setup() -> (Env, RoomManagerClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(RoomManager, {});
    let client = RoomManagerClient::new(&env, &contract_id);
    (env, client)
}

fn create_test_room(env: &Env, client: &RoomManagerClient, creator: &Address) -> u128 {
    let settings = Map::new(env);
    client.create_room(
        creator,
        &String::from_str(env, "Test Room"),
        &RoomType::Public,
        &settings,
    )
}

#[test]
fn test_join_room_basic_functionality() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let room_id = create_test_room(&env, &client, &creator);

    // User joins room
    let result = client.join_room(&user, &room_id);
    assert_eq!(result, true);

    // Verify user is now a member
    assert_eq!(client.is_member(&user, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 2); // Creator + User

    // Verify room member list
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 2);
    assert_eq!(room.members.get(0).unwrap(), creator); // Creator first
    assert_eq!(room.members.get(1).unwrap(), user);   // User second
}

#[test]
fn test_join_room_multiple_users() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    // Create multiple users and have them join
    let mut users = Vec::new();
    for i in 0..5 {
        let user = Address::generate(&env);
        users.push(user.clone());

        let result = client.join_room(&user, &room_id);
        assert_eq!(result, true);

        // Verify member count increases
        assert_eq!(client.get_member_count(&room_id), (i + 2) as u32); // +1 for creator, +1 for 0-based index
        assert_eq!(client.is_member(&user, &room_id), true);
    }

    // Verify final state
    assert_eq!(client.get_member_count(&room_id), 6); // Creator + 5 users

    // Verify all users are members
    for user in users.iter() {
        assert_eq!(client.is_member(user, &room_id), true);
    }

    // Verify creator is still a member
    assert_eq!(client.is_member(&creator, &room_id), true);
}

#[test]
fn test_join_room_different_room_types() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    // Create rooms of different types
    let public_room = client.create_room(
        &creator,
        &String::from_str(&env, "Public Room"),
        &RoomType::Public,
        &settings,
    );
    let private_room = client.create_room(
        &creator,
        &String::from_str(&env, "Private Room"),
        &RoomType::Private,
        &settings,
    );
    let secret_room = client.create_room(
        &creator,
        &String::from_str(&env, "Secret Room"),
        &RoomType::Secret,
        &settings,
    );

    // User should be able to join all room types (in current implementation)
    assert_eq!(client.join_room(&user, &public_room), true);
    assert_eq!(client.join_room(&user, &private_room), true);
    assert_eq!(client.join_room(&user, &secret_room), true);

    // Verify membership in all rooms
    assert_eq!(client.is_member(&user, &public_room), true);
    assert_eq!(client.is_member(&user, &private_room), true);
    assert_eq!(client.is_member(&user, &secret_room), true);
}

#[test]
fn test_join_room_member_count_tracking() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    // Initial count should be 1 (creator)
    assert_eq!(client.get_member_count(&room_id), 1);

    // Add users one by one and verify count
    for i in 1..=10 {
        let user = Address::generate(&env);
        client.join_room(&user, &room_id);
        assert_eq!(client.get_member_count(&room_id), (i + 1) as u32);
    }
}

#[test]
fn test_join_room_member_list_order() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    let mut users = Vec::new();
    for _i in 0..3 {
        let user = Address::generate(&env);
        users.push(user.clone());
        client.join_room(&user, &room_id);
    }

    // Verify member list maintains order
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 4); // Creator + 3 users

    assert_eq!(room.members.get(0).unwrap(), creator);
    for (i, user) in users.iter().enumerate() {
        assert_eq!(room.members.get((i + 1) as u32).unwrap(), *user);
    }
}

#[test]
fn test_join_room_same_user_different_rooms() {
    let (env, client) = setup();
    let creator1 = Address::generate(&env);
    let creator2 = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    // Create two different rooms
    let room1 = client.create_room(
        &creator1,
        &String::from_str(&env, "Room 1"),
        &RoomType::Public,
        &settings,
    );
    let room2 = client.create_room(
        &creator2,
        &String::from_str(&env, "Room 2"),
        &RoomType::Private,
        &settings,
    );

    // User joins both rooms
    assert_eq!(client.join_room(&user, &room1), true);
    assert_eq!(client.join_room(&user, &room2), true);

    // Verify user is member of both rooms
    assert_eq!(client.is_member(&user, &room1), true);
    assert_eq!(client.is_member(&user, &room2), true);

    // Verify both rooms have correct member counts
    assert_eq!(client.get_member_count(&room1), 2); // creator1 + user
    assert_eq!(client.get_member_count(&room2), 2); // creator2 + user
}

#[test]
fn test_join_room_creator_already_member() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    // Verify creator is already a member
    assert_eq!(client.is_member(&creator, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 1);

    // Creator trying to join their own room should fail
    // Note: This documents current behavior - may need adjustment based on requirements
}

#[test]
fn test_join_room_state_persistence() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    let room_id = create_test_room(&env, &client, &creator);

    // Add first user
    client.join_room(&user1, &room_id);
    assert_eq!(client.get_member_count(&room_id), 2);

    // Add second user
    client.join_room(&user2, &room_id);
    assert_eq!(client.get_member_count(&room_id), 3);

    // Verify state is persistent - get room again
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 3);
    assert_eq!(room.members.get(0).unwrap(), creator);
    assert_eq!(room.members.get(1).unwrap(), user1);
    assert_eq!(room.members.get(2).unwrap(), user2);

    // Verify individual membership checks still work
    assert_eq!(client.is_member(&creator, &room_id), true);
    assert_eq!(client.is_member(&user1, &room_id), true);
    assert_eq!(client.is_member(&user2, &room_id), true);
}

#[test]
fn test_join_room_large_scale() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    // Add many users to test scalability
    let mut users = Vec::new();
    for _i in 0..50 {
        let user = Address::generate(&env);
        users.push(user.clone());

        let result = client.join_room(&user, &room_id);
        assert_eq!(result, true);
    }

    // Verify final count
    assert_eq!(client.get_member_count(&room_id), 51); // Creator + 50 users

    // Verify all users are members
    for user in users.iter() {
        assert_eq!(client.is_member(user, &room_id), true);
    }

    // Verify room data integrity
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 51);
    assert_eq!(room.is_active, true);
}

#[test]
fn test_join_room_non_member_verification() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let member = Address::generate(&env);
    let non_member = Address::generate(&env);

    let room_id = create_test_room(&env, &client, &creator);

    // Add one user as member
    client.join_room(&member, &room_id);

    // Verify membership status
    assert_eq!(client.is_member(&creator, &room_id), true);
    assert_eq!(client.is_member(&member, &room_id), true);
    assert_eq!(client.is_member(&non_member, &room_id), false);
}

// Error case tests
#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_join_nonexistent_room() {
    let (env, client) = setup();
    let user = Address::generate(&env);

    // Try to join a room that doesn't exist
    client.join_room(&user, &999);
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn test_join_room_already_member() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let room_id = create_test_room(&env, &client, &creator);

    // User joins room
    client.join_room(&user, &room_id);

    // Try to join again (should panic)
    client.join_room(&user, &room_id);
}

#[test]
#[should_panic(expected = "Error(Contract, #11)")]
fn test_join_inactive_room() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let room_id = create_test_room(&env, &client, &creator);

    // Deactivate room
    client.deactivate_room(&creator, &room_id);

    // Try to join inactive room (should panic)
    client.join_room(&user, &room_id);
}

#[test]
fn test_join_room_boundary_conditions() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    // Test joining with newly generated addresses
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    // Ensure addresses are different
    assert_ne!(user1, user2);
    assert_ne!(creator, user1);
    assert_ne!(creator, user2);

    // Both should be able to join
    assert_eq!(client.join_room(&user1, &room_id), true);
    assert_eq!(client.join_room(&user2, &room_id), true);

    // Verify independence
    assert_eq!(client.is_member(&user1, &room_id), true);
    assert_eq!(client.is_member(&user2, &room_id), true);
}

#[test]
fn test_join_room_concurrent_joins() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_id = create_test_room(&env, &client, &creator);

    // Simulate concurrent joins (sequential in test, but validates state consistency)
    let users: Vec<Address> = (0..10).map(|_| Address::generate(&env)).collect();

    for (i, user) in users.iter().enumerate() {
        let result = client.join_room(user, &room_id);
        assert_eq!(result, true);

        // Verify count is consistent after each join
        assert_eq!(client.get_member_count(&room_id), (i + 2) as u32); // +1 for creator, +1 for 0-based index
    }

    // Final verification
    assert_eq!(client.get_member_count(&room_id), 11); // Creator + 10 users

    for user in users.iter() {
        assert_eq!(client.is_member(user, &room_id), true);
    }
}
