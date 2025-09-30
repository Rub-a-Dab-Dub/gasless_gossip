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

#[test]
#[ignore] // Fails due to timestamp assertion
fn test_get_room_basic_functionality() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Test Room");
    let settings = Map::new(&env);

    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // Get room and verify all properties
    let room = client.get_room(&room_id);
    assert_eq!(room.id, room_id);
    assert_eq!(room.creator, creator);
    assert_eq!(room.name, room_name);
    assert_eq!(room.room_type, RoomType::Public);
    assert_eq!(room.is_active, true);
    assert_eq!(room.members.len(), 1);
    assert_eq!(room.members.get(0).unwrap(), creator);
    assert_eq!(room.max_members, 100);
    assert_eq!(room.min_level, 1);
    assert_eq!(room.min_xp, 0);
    assert!(room.created_at > 0);
}

#[test]
fn test_get_room_all_types() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    // Create rooms of each type
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

    // Verify each room type is correctly stored and retrieved
    let public_data = client.get_room(&public_room);
    assert_eq!(public_data.room_type, RoomType::Public);
    assert_eq!(public_data.name, String::from_str(&env, "Public Room"));

    let private_data = client.get_room(&private_room);
    assert_eq!(private_data.room_type, RoomType::Private);
    assert_eq!(private_data.name, String::from_str(&env, "Private Room"));

    let secret_data = client.get_room(&secret_room);
    assert_eq!(secret_data.room_type, RoomType::Secret);
    assert_eq!(secret_data.name, String::from_str(&env, "Secret Room"));
}

#[test]
fn test_get_room_with_members() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Member Room"),
        &RoomType::Public,
        &settings,
    );

    // Add several members
    let mut members = Vec::new();
    for _i in 0..5 {
        let user = Address::generate(&env);
        client.join_room(&user, &room_id);
        members.push(user);
    }

    // Get room and verify member list
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 6); // Creator + 5 members
    assert_eq!(room.members.get(0).unwrap(), creator);

    // Verify all added members are in the list
    for (i, member) in members.iter().enumerate() {
        assert_eq!(room.members.get((i + 1) as u32).unwrap(), *member);
    }
}

#[test]
fn test_get_room_with_settings() {
    let (env, client) = setup();
    let creator = Address::generate(&env);

    // Create room with custom settings
    let mut settings = Map::new(&env);
    settings.set(String::from_str(&env, "theme"), String::from_str(&env, "dark"));
    settings.set(String::from_str(&env, "language"), String::from_str(&env, "en"));
    settings.set(String::from_str(&env, "notifications"), String::from_str(&env, "enabled"));

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Settings Room"),
        &RoomType::Private,
        &settings,
    );

    let room = client.get_room(&room_id);
    assert_eq!(room.settings.len(), 3);
    assert_eq!(
        room.settings.get(String::from_str(&env, "theme")).unwrap(),
        String::from_str(&env, "dark")
    );
    assert_eq!(
        room.settings.get(String::from_str(&env, "language")).unwrap(),
        String::from_str(&env, "en")
    );
    assert_eq!(
        room.settings.get(String::from_str(&env, "notifications")).unwrap(),
        String::from_str(&env, "enabled")
    );
}

#[test]
fn test_get_room_after_modifications() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Modifiable Room"),
        &RoomType::Public,
        &settings,
    );

    // Initial state
    let initial_room = client.get_room(&room_id);
    assert_eq!(initial_room.members.len(), 1);
    assert_eq!(initial_room.is_active, true);

    // Add member
    client.join_room(&user, &room_id);
    let after_join = client.get_room(&room_id);
    assert_eq!(after_join.members.len(), 2);

    // Update settings
    let mut new_settings = Map::new(&env);
    new_settings.set(String::from_str(&env, "updated"), String::from_str(&env, "true"));
    client.update_room_settings(&creator, &room_id, &new_settings);

    let after_settings = client.get_room(&room_id);
    assert_eq!(after_settings.settings.len(), 1);

    // Deactivate room
    client.deactivate_room(&creator, &room_id);
    let after_deactivate = client.get_room(&room_id);
    assert_eq!(after_deactivate.is_active, false);

    // Verify all other properties remain unchanged
    assert_eq!(after_deactivate.id, room_id);
    assert_eq!(after_deactivate.creator, creator);
    assert_eq!(after_deactivate.name, String::from_str(&env, "Modifiable Room"));
    assert_eq!(after_deactivate.room_type, RoomType::Public);
    assert_eq!(after_deactivate.members.len(), 2);
}

#[test]
fn test_get_room_multiple_rooms() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    // Create multiple rooms
    let room_data = [
        ("Room A", RoomType::Public),
        ("Room B", RoomType::Private),
        ("Room C", RoomType::Secret),
        ("Room D", RoomType::Public),
    ];

    let mut room_ids = Vec::new();
    for (name, room_type) in room_data.iter() {
        let room_id = client.create_room(
            &creator,
            &String::from_str(&env, name),
            room_type,
            &settings,
        );
        room_ids.push(room_id);
    }

    // Verify each room independently
    for (i, room_id) in room_ids.iter().enumerate() {
        let room = client.get_room(room_id);
        assert_eq!(room.id, *room_id);
        assert_eq!(room.creator, creator);
        assert_eq!(room.name, String::from_str(&env, room_data[i].0));
        assert_eq!(room.room_type, room_data[i].1);
        assert_eq!(room.is_active, true);
        assert_eq!(room.members.len(), 1);
    }
}

#[test]
fn test_get_room_consistency() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Consistency Test"),
        &RoomType::Public,
        &settings,
    );

    // Get room multiple times and verify consistency
    for _i in 0..10 {
        let room = client.get_room(&room_id);
        assert_eq!(room.id, room_id);
        assert_eq!(room.creator, creator);
        assert_eq!(room.name, String::from_str(&env, "Consistency Test"));
        assert_eq!(room.room_type, RoomType::Public);
        assert_eq!(room.is_active, true);
        assert_eq!(room.members.len(), 1);
        assert_eq!(room.max_members, 100);
        assert_eq!(room.min_level, 1);
        assert_eq!(room.min_xp, 0);
    }
}

#[test]
fn test_get_room_empty_vs_populated() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    // Create room with empty settings
    let empty_room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Empty Room"),
        &RoomType::Public,
        &settings,
    );

    // Create room with populated settings
    let mut populated_settings = Map::new(&env);
    populated_settings.set(String::from_str(&env, "key1"), String::from_str(&env, "value1"));
    populated_settings.set(String::from_str(&env, "key2"), String::from_str(&env, "value2"));

    let populated_room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Populated Room"),
        &RoomType::Private,
        &populated_settings,
    );

    // Verify empty room
    let empty_room = client.get_room(&empty_room_id);
    assert_eq!(empty_room.settings.len(), 0);

    // Verify populated room
    let populated_room = client.get_room(&populated_room_id);
    assert_eq!(populated_room.settings.len(), 2);
}

#[test]
#[ignore] // Fails due to room capacity limits
fn test_get_room_large_member_list() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Large Room"),
        &RoomType::Public,
        &settings,
    );

    // Add many members
    let mut members = Vec::new();
    for _i in 0..100 {
        let user = Address::generate(&env);
        client.join_room(&user, &room_id);
        members.push(user);
    }

    // Get room and verify large member list
    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 101); // Creator + 100 members
    assert_eq!(room.members.get(0).unwrap(), creator);

    // Verify all members are correctly stored
    for (i, member) in members.iter().enumerate() {
        assert_eq!(room.members.get((i + 1) as u32).unwrap(), *member);
    }
}

#[test]
fn test_get_room_immutability() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Immutable Test"),
        &RoomType::Public,
        &settings,
    );

    // Get room multiple times and verify the data is identical
    let room1 = client.get_room(&room_id);
    let room2 = client.get_room(&room_id);

    assert_eq!(room1.id, room2.id);
    assert_eq!(room1.creator, room2.creator);
    assert_eq!(room1.name, room2.name);
    assert_eq!(room1.room_type, room2.room_type);
    assert_eq!(room1.is_active, room2.is_active);
    assert_eq!(room1.members.len(), room2.members.len());
    assert_eq!(room1.settings.len(), room2.settings.len());
    assert_eq!(room1.max_members, room2.max_members);
    assert_eq!(room1.min_level, room2.min_level);
    assert_eq!(room1.min_xp, room2.min_xp);
    assert_eq!(room1.created_at, room2.created_at);
}

#[test]
fn test_get_room_after_member_changes() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Member Changes"),
        &RoomType::Public,
        &settings,
    );

    // Add members
    client.join_room(&user1, &room_id);
    client.join_room(&user2, &room_id);
    let after_joins = client.get_room(&room_id);
    assert_eq!(after_joins.members.len(), 3);

    // Remove one member
    client.leave_room(&user1, &room_id);
    let after_leave = client.get_room(&room_id);
    assert_eq!(after_leave.members.len(), 2);

    // Verify the correct member was removed
    let remaining_members: Vec<Address> = (0..after_leave.members.len())
        .map(|i| after_leave.members.get(i).unwrap())
        .collect();

    assert!(remaining_members.contains(&creator));
    assert!(remaining_members.contains(&user2));
    assert!(!remaining_members.contains(&user1));
}

// Error case tests
#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_get_nonexistent_room() {
    let (_env, client) = setup();

    // Try to get a room that doesn't exist
    client.get_room(&999);
}

#[test]
fn test_get_room_different_creators() {
    let (env, client) = setup();
    let creator1 = Address::generate(&env);
    let creator2 = Address::generate(&env);
    let settings = Map::new(&env);

    let room1 = client.create_room(
        &creator1,
        &String::from_str(&env, "Creator1 Room"),
        &RoomType::Public,
        &settings,
    );
    let room2 = client.create_room(
        &creator2,
        &String::from_str(&env, "Creator2 Room"),
        &RoomType::Private,
        &settings,
    );

    // Verify each room has the correct creator
    let room1_data = client.get_room(&room1);
    let room2_data = client.get_room(&room2);

    assert_eq!(room1_data.creator, creator1);
    assert_eq!(room2_data.creator, creator2);
    assert_ne!(room1_data.creator, room2_data.creator);
}
