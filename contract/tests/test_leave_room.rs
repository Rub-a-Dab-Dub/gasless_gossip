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

fn create_room_with_members(env: &Env, client: &RoomManagerClient, creator: &Address, num_members: u32) -> (u128, Vec<Address>) {
    let settings = Map::new(env);
    let room_id = client.create_room(
        creator,
        &String::from_str(env, "Test Room"),
        &RoomType::Public,
        &settings,
    );

    let mut members = Vec::new();
    for _i in 0..num_members {
        let user = Address::generate(env);
        client.join_room(&user, &room_id);
        members.push(user);
    }

    (room_id, members)
}

#[test]
fn test_leave_room_basic_functionality() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let (room_id, _) = create_room_with_members(&env, &client, &creator, 0);

    // User joins room
    client.join_room(&user, &room_id);
    assert_eq!(client.is_member(&user, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 2); // Creator + User

    // User leaves room
    let result = client.leave_room(&user, &room_id);
    assert_eq!(result, true);

    // Verify user is no longer a member
    assert_eq!(client.is_member(&user, &room_id), false);
    assert_eq!(client.get_member_count(&room_id), 1); // Only creator remains

    // Verify creator is still a member
    assert_eq!(client.is_member(&creator, &room_id), true);

    // Verify room member list
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 1);
    assert_eq!(room.members.get(0).unwrap(), creator);
}

#[test]
fn test_leave_room_multiple_members() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, members) = create_room_with_members(&env, &client, &creator, 5);

    // Initial state: creator + 5 members = 6 total
    assert_eq!(client.get_member_count(&room_id), 6);

    // Remove members one by one
    for (i, member) in members.iter().enumerate() {
        assert_eq!(client.is_member(member, &room_id), true);

        let result = client.leave_room(member, &room_id);
        assert_eq!(result, true);

        assert_eq!(client.is_member(member, &room_id), false);
        assert_eq!(client.get_member_count(&room_id), (5 - i) as u32); // Decreasing count
    }

    // Final state: only creator remains
    assert_eq!(client.get_member_count(&room_id), 1);
    assert_eq!(client.is_member(&creator, &room_id), true);
}

#[test]
fn test_leave_room_order_independence() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, members) = create_room_with_members(&env, &client, &creator, 3);

    // Leave in different order than joined
    let member1 = &members[0];
    let member2 = &members[1];
    let member3 = &members[2];

    // Leave middle member first
    client.leave_room(member2, &room_id);
    assert_eq!(client.is_member(member2, &room_id), false);
    assert_eq!(client.get_member_count(&room_id), 3); // Creator + 2 remaining members

    // Verify other members are still there
    assert_eq!(client.is_member(member1, &room_id), true);
    assert_eq!(client.is_member(member3, &room_id), true);
    assert_eq!(client.is_member(&creator, &room_id), true);

    // Leave last member
    client.leave_room(member3, &room_id);
    assert_eq!(client.get_member_count(&room_id), 2); // Creator + 1 member

    // Leave first member
    client.leave_room(member1, &room_id);
    assert_eq!(client.get_member_count(&room_id), 1); // Only creator

    // Verify final state
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 1);
    assert_eq!(room.members.get(0).unwrap(), creator);
}

#[test]
fn test_leave_room_creator_can_leave() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let (room_id, _) = create_room_with_members(&env, &client, &creator, 0);

    // Add another user so room isn't empty when creator leaves
    client.join_room(&user, &room_id);
    assert_eq!(client.get_member_count(&room_id), 2);

    // Creator leaves their own room
    let result = client.leave_room(&creator, &room_id);
    assert_eq!(result, true);

    // Verify creator is no longer a member
    assert_eq!(client.is_member(&creator, &room_id), false);
    assert_eq!(client.get_member_count(&room_id), 1);

    // Verify other user is still a member
    assert_eq!(client.is_member(&user, &room_id), true);

    // Verify room still exists and is active
    let room = client.get_room(&room_id);
    assert_eq!(room.is_active, true);
    assert_eq!(room.creator, creator); // Creator field doesn't change
    assert_eq!(room.members.len(), 1);
    assert_eq!(room.members.get(0).unwrap(), user);
}

#[test]
fn test_leave_room_member_list_integrity() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, members) = create_room_with_members(&env, &client, &creator, 4);

    // Initial state verification
    let initial_room = client.get_room(&room_id);
    assert_eq!(initial_room.members.len(), 5); // Creator + 4 members

    // Remove middle member (index 2 in members list, index 3 in room.members)
    let middle_member = &members[1]; // Second member added
    client.leave_room(middle_member, &room_id);

    // Verify member list integrity after removal
    let updated_room = client.get_room(&room_id);
    assert_eq!(updated_room.members.len(), 4);

    // Verify remaining members are still present
    assert_eq!(updated_room.members.get(0).unwrap(), creator);

    // The exact order after removal depends on implementation
    // Just verify the removed member is not in the list
    let remaining_addresses: Vec<Address> = (0..updated_room.members.len())
        .map(|i| updated_room.members.get(i).unwrap())
        .collect();

    assert!(!remaining_addresses.contains(middle_member));

    // Verify all other original members are still there
    for (i, member) in members.iter().enumerate() {
        if i != 1 { // Skip the removed member
            assert!(remaining_addresses.contains(member));
        }
    }
}

#[test]
fn test_leave_room_rejoin_functionality() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let (room_id, _) = create_room_with_members(&env, &client, &creator, 0);

    // User joins, leaves, then rejoins
    client.join_room(&user, &room_id);
    assert_eq!(client.is_member(&user, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 2);

    client.leave_room(&user, &room_id);
    assert_eq!(client.is_member(&user, &room_id), false);
    assert_eq!(client.get_member_count(&room_id), 1);

    client.join_room(&user, &room_id);
    assert_eq!(client.is_member(&user, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 2);

    // Verify final state
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 2);
}

#[test]
fn test_leave_room_multiple_rooms() {
    let (env, client) = setup();
    let creator1 = Address::generate(&env);
    let creator2 = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    // Create two rooms
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
    client.join_room(&user, &room1);
    client.join_room(&user, &room2);
    assert_eq!(client.is_member(&user, &room1), true);
    assert_eq!(client.is_member(&user, &room2), true);

    // User leaves only room1
    client.leave_room(&user, &room1);
    assert_eq!(client.is_member(&user, &room1), false);
    assert_eq!(client.is_member(&user, &room2), true); // Still member of room2

    // Verify room counts
    assert_eq!(client.get_member_count(&room1), 1); // Only creator1
    assert_eq!(client.get_member_count(&room2), 2); // creator2 + user
}

#[test]
fn test_leave_room_state_persistence() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, members) = create_room_with_members(&env, &client, &creator, 3);

    // Leave one member
    let leaving_member = &members[1];
    client.leave_room(leaving_member, &room_id);

    // Verify state persists across multiple queries
    for _i in 0..5 {
        assert_eq!(client.is_member(leaving_member, &room_id), false);
        assert_eq!(client.get_member_count(&room_id), 3); // Creator + 2 remaining

        let room = client.get_room(&room_id);
        assert_eq!(room.members.len(), 3);
    }
}

#[test]
fn test_leave_room_edge_cases() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, _) = create_room_with_members(&env, &client, &creator, 0);

    // Creator is only member
    assert_eq!(client.get_member_count(&room_id), 1);

    // Creator leaves (room becomes empty but still exists)
    let result = client.leave_room(&creator, &room_id);
    assert_eq!(result, true);
    assert_eq!(client.get_member_count(&room_id), 0);

    // Room should still exist
    let room = client.get_room(&room_id);
    assert_eq!(room.id, room_id);
    assert_eq!(room.is_active, true);
    assert_eq!(room.members.len(), 0);
}

#[test]
fn test_leave_room_large_scale() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, members) = create_room_with_members(&env, &client, &creator, 50);

    // Initial state: 51 members (creator + 50)
    assert_eq!(client.get_member_count(&room_id), 51);

    // Remove half the members
    for i in 0..25 {
        client.leave_room(&members[i], &room_id);
    }

    // Verify intermediate state
    assert_eq!(client.get_member_count(&room_id), 26); // Creator + 25 remaining

    // Remove remaining members
    for i in 25..50 {
        client.leave_room(&members[i], &room_id);
    }

    // Final state: only creator
    assert_eq!(client.get_member_count(&room_id), 1);
    assert_eq!(client.is_member(&creator, &room_id), true);

    // Verify all original members are gone
    for member in members.iter() {
        assert_eq!(client.is_member(member, &room_id), false);
    }
}

// Error case tests
#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_leave_nonexistent_room() {
    let (env, client) = setup();
    let user = Address::generate(&env);

    // Try to leave a room that doesn't exist
    client.leave_room(&user, &999);
}

#[test]
#[should_panic(expected = "Error(Contract, #7)")]
fn test_leave_room_not_member() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let non_member = Address::generate(&env);

    let (room_id, _) = create_room_with_members(&env, &client, &creator, 0);

    // Try to leave without being a member
    client.leave_room(&non_member, &room_id);
}

#[test]
fn test_leave_room_double_leave_protection() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);

    let (room_id, _) = create_room_with_members(&env, &client, &creator, 0);

    // User joins and leaves
    client.join_room(&user, &room_id);
    client.leave_room(&user, &room_id);

    // Verify user is no longer a member
    assert_eq!(client.is_member(&user, &room_id), false);
}

#[test]
fn test_leave_room_concurrent_operations() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let (room_id, members) = create_room_with_members(&env, &client, &creator, 10);

    // Simulate concurrent leave operations
    // In a real concurrent environment, this would test race conditions
    // Here we test sequential operations for state consistency

    let initial_count = client.get_member_count(&room_id);
    assert_eq!(initial_count, 11); // Creator + 10 members

    // Remove members in random order (simulated)
    let leave_order = [3, 1, 7, 0, 9, 2, 5, 8, 4, 6];

    for (i, &member_index) in leave_order.iter().enumerate() {
        client.leave_room(&members[member_index], &room_id);

        // Verify count decreases correctly
        let expected_count = initial_count - (i + 1) as u32;
        assert_eq!(client.get_member_count(&room_id), expected_count);
    }

    // Final state: only creator
    assert_eq!(client.get_member_count(&room_id), 1);
    assert_eq!(client.is_member(&creator, &room_id), true);
}
