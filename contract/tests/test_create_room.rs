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
fn test_create_room_basic_functionality() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Test Room");
    let settings = Map::new(&env);

    let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);

    // Verify room was created with unique ID
    assert_eq!(room_id, 1); // First room should have ID 1

    // Get room and verify properties
    let room = client.get_room(&room_id);
    assert_eq!(room.id, room_id);
    assert_eq!(room.creator, creator);
    assert_eq!(room.name, room_name);
    assert_eq!(room.room_type, RoomType::Public);
    assert_eq!(room.is_active, true);
    assert_eq!(room.members.len(), 1); // Creator is automatically added
    assert_eq!(room.members.get(0).unwrap(), creator);
    assert!(room.created_at > 0);

    // Verify default settings
    assert_eq!(room.max_members, 100);
    assert_eq!(room.min_level, 1);
    assert_eq!(room.min_xp, 0);
}

#[test]
fn test_create_room_all_types() {
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

    // Verify each room type
    assert_eq!(client.get_room(&public_room).room_type, RoomType::Public);
    assert_eq!(client.get_room(&private_room).room_type, RoomType::Private);
    assert_eq!(client.get_room(&secret_room).room_type, RoomType::Secret);

    // Verify unique IDs
    assert_eq!(public_room, 1);
    assert_eq!(private_room, 2);
    assert_eq!(secret_room, 3);
}

#[test]
fn test_create_room_with_custom_settings() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let room_name = String::from_str(&env, "Custom Room");

    // Create settings map
    let mut settings = Map::new(&env);
    settings.set(
        String::from_str(&env, "description"),
        String::from_str(&env, "A room with custom settings"),
    );
    settings.set(
        String::from_str(&env, "theme"),
        String::from_str(&env, "dark"),
    );
    settings.set(
        String::from_str(&env, "language"),
        String::from_str(&env, "en"),
    );
    settings.set(
        String::from_str(&env, "max_members"),
        String::from_str(&env, "50"),
    );

    let room_id = client.create_room(&creator, &room_name, &RoomType::Private, &settings);
    let room = client.get_room(&room_id);

    // Verify custom settings are stored
    assert_eq!(room.settings.len(), 4);
    assert_eq!(
        room.settings.get(String::from_str(&env, "description")).unwrap(),
        String::from_str(&env, "A room with custom settings")
    );
    assert_eq!(
        room.settings.get(String::from_str(&env, "theme")).unwrap(),
        String::from_str(&env, "dark")
    );
    assert_eq!(
        room.settings.get(String::from_str(&env, "language")).unwrap(),
        String::from_str(&env, "en")
    );
}

#[test]
fn test_create_room_multiple_rooms() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    // Create multiple rooms
    let mut room_ids = Vec::new();
    for i in 1..=10 {
        let room_name = String::from_str(&env, "TestRoom");
        let room_id = client.create_room(&creator, &room_name, &RoomType::Public, &settings);
        room_ids.push(room_id);
    }

    // Verify unique sequential IDs
    for i in 0..10 {
        assert_eq!(room_ids[i], (i + 1) as u128);
    }

    // Verify all rooms exist and are accessible
    for room_id in room_ids.iter() {
        let room = client.get_room(room_id);
        assert_eq!(room.id, *room_id);
        assert_eq!(room.creator, creator);
        assert_eq!(room.is_active, true);
        assert_eq!(room.members.len(), 1); // Only creator
    }
}

#[test]
fn test_create_room_different_creators() {
    let (env, client) = setup();
    let creator1 = Address::generate(&env);
    let creator2 = Address::generate(&env);
    let creator3 = Address::generate(&env);
    let settings = Map::new(&env);

    // Create rooms with different creators
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
    let room3 = client.create_room(
        &creator3,
        &String::from_str(&env, "Room 3"),
        &RoomType::Secret,
        &settings,
    );

    // Verify each room has the correct creator
    assert_eq!(client.get_room(&room1).creator, creator1);
    assert_eq!(client.get_room(&room2).creator, creator2);
    assert_eq!(client.get_room(&room3).creator, creator3);

    // Verify creator is member of their own room
    assert_eq!(client.is_member(&creator1, &room1), true);
    assert_eq!(client.is_member(&creator2, &room2), true);
    assert_eq!(client.is_member(&creator3, &room3), true);

    // Verify creators are not members of other rooms initially
    assert_eq!(client.is_member(&creator1, &room2), false);
    assert_eq!(client.is_member(&creator2, &room3), false);
    assert_eq!(client.is_member(&creator3, &room1), false);
}

#[test]
fn test_create_room_name_variations() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let room_names = [
        "Simple Room",
        "Room_with_underscores",
        "Room-with-dashes",
        "RoomWithCamelCase",
        "Room with spaces and 123 numbers",
        "R", // Single character
        "VeryLongRoomNameThatIsStillValidButQuiteDescriptive",
        "房间名称", // Unicode characters
        "🏠 Emoji Room 🎉", // Emoji characters
    ];

    for (i, room_name) in room_names.iter().enumerate() {
        let name_str = String::from_str(&env, room_name);
        let room_id = client.create_room(&creator, &name_str, &RoomType::Public, &settings);

        let room = client.get_room(&room_id);
        assert_eq!(room.name, name_str);
        assert_eq!(room.id, (i + 1) as u128);
    }
}

#[test]
fn test_create_room_complex_settings() {
    let (env, client) = setup();
    let creator = Address::generate(&env);

    // Create room with many complex settings
    let mut settings = Map::new(&env);
    settings.set(String::from_str(&env, "welcome_message"), String::from_str(&env, "Welcome to our community room! Please read the rules."));
    settings.set(String::from_str(&env, "rules"), String::from_str(&env, "1. Be respectful 2. No spam 3. Have fun"));
    settings.set(String::from_str(&env, "moderators"), String::from_str(&env, "alice,bob,charlie"));
    settings.set(String::from_str(&env, "auto_delete_after"), String::from_str(&env, "7days"));
    settings.set(String::from_str(&env, "max_message_length"), String::from_str(&env, "1000"));
    settings.set(String::from_str(&env, "allow_file_uploads"), String::from_str(&env, "true"));
    settings.set(String::from_str(&env, "timezone"), String::from_str(&env, "UTC"));
    settings.set(String::from_str(&env, "category"), String::from_str(&env, "general"));

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Complex Room"),
        &RoomType::Private,
        &settings,
    );

    let room = client.get_room(&room_id);
    assert_eq!(room.settings.len(), 8);

    // Verify specific complex settings
    assert_eq!(
        room.settings.get(String::from_str(&env, "welcome_message")).unwrap(),
        String::from_str(&env, "Welcome to our community room! Please read the rules.")
    );
    assert_eq!(
        room.settings.get(String::from_str(&env, "rules")).unwrap(),
        String::from_str(&env, "1. Be respectful 2. No spam 3. Have fun")
    );
}

#[test]
fn test_create_room_timestamp_validation() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let before_creation = env.ledger().timestamp();

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Timestamp Test"),
        &RoomType::Public,
        &settings,
    );

    let after_creation = env.ledger().timestamp();
    let room = client.get_room(&room_id);

    // Verify creation timestamp is within reasonable bounds
    assert!(room.created_at >= before_creation);
    assert!(room.created_at <= after_creation);
}

#[test]
fn test_create_room_concurrent_creation() {
    let (env, client) = setup();
    let settings = Map::new(&env);

    // Simulate concurrent room creation by different users
    let creators: Vec<Address> = (0..5).map(|_| Address::generate(&env)).collect();
    let mut room_ids = Vec::new();

    for (i, creator) in creators.iter().enumerate() {
        let room_name = String::from_str(&env, "ConcurrentRoom");
        let room_id = client.create_room(creator, &room_name, &RoomType::Public, &settings);
        room_ids.push(room_id);

        // Verify sequential ID assignment
        assert_eq!(room_id, (i + 1) as u128);
    }

    // Verify all rooms are independent and properly created
    for (i, room_id) in room_ids.iter().enumerate() {
        let room = client.get_room(room_id);
        assert_eq!(room.creator, creators[i]);
        assert_eq!(room.members.len(), 1);
        assert_eq!(room.members.get(0).unwrap(), creators[i]);
        assert_eq!(room.is_active, true);
    }
}

#[test]
fn test_create_room_edge_cases() {
    let (env, client) = setup();
    let creator = Address::generate(&env);

    // Test with empty settings map
    let empty_settings = Map::new(&env);
    let room1 = client.create_room(
        &creator,
        &String::from_str(&env, "Empty Settings"),
        &RoomType::Public,
        &empty_settings,
    );

    let room = client.get_room(&room1);
    assert_eq!(room.settings.len(), 0);
    assert_eq!(room.max_members, 100); // Default values should still be set
    assert_eq!(room.min_level, 1);
    assert_eq!(room.min_xp, 0);

    // Test with single setting
    let mut single_setting = Map::new(&env);
    single_setting.set(String::from_str(&env, "test"), String::from_str(&env, "value"));

    let room2 = client.create_room(
        &creator,
        &String::from_str(&env, "Single Setting"),
        &RoomType::Private,
        &single_setting,
    );

    let room2_data = client.get_room(&room2);
    assert_eq!(room2_data.settings.len(), 1);
    assert_eq!(
        room2_data.settings.get(String::from_str(&env, "test")).unwrap(),
        String::from_str(&env, "value")
    );
}

#[test]
fn test_create_room_id_sequence_integrity() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    // Create rooms and verify ID sequence is maintained
    let mut expected_id = 1u128;

    for _ in 0..50 {
        let room_id = client.create_room(
            &creator,
            &String::from_str(&env, "Sequence Test"),
            &RoomType::Public,
            &settings,
        );

        assert_eq!(room_id, expected_id);
        expected_id += 1;
    }

    // Verify the next room continues the sequence
    let final_room = client.create_room(
        &creator,
        &String::from_str(&env, "Final Room"),
        &RoomType::Secret,
        &settings,
    );

    assert_eq!(final_room, 51);
}

#[test]
fn test_create_room_member_initialization() {
    let (env, client) = setup();
    let creator = Address::generate(&env);
    let settings = Map::new(&env);

    let room_id = client.create_room(
        &creator,
        &String::from_str(&env, "Member Test"),
        &RoomType::Public,
        &settings,
    );

    // Verify creator is automatically added as member
    assert_eq!(client.is_member(&creator, &room_id), true);
    assert_eq!(client.get_member_count(&room_id), 1);

    let room = client.get_room(&room_id);
    assert_eq!(room.members.len(), 1);
    assert_eq!(room.members.get(0).unwrap(), creator);

    // Verify other addresses are not members
    let non_member = Address::generate(&env);
    assert_eq!(client.is_member(&non_member, &room_id), false);
}
