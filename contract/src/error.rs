use soroban_sdk::{contracterror, panic_with_error, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    UserAlreadyRegistered = 1,
    UserNotRegistered = 2,
    InvalidUsernameLength = 3,
    InvalidXpAmount = 4,
    RoomNotFound = 5,
    UserAlreadyMember = 6,
    UserNotMember = 7,
    RoomCapacityFull = 8,
    InsufficientLevel = 9,
    InsufficientXp = 10,
    RoomNotActive = 11,
    InvalidRoomType = 12,
    RoomAlreadyExists = 13,
    OnlyRoomCreatorCanUpdate = 14,
    OnlyRoomCreatorCanDeactivate = 15,
    StorageError = 16,
}

pub fn handle_error(env: &Env, error: Error) -> ! {
    panic_with_error!(env, error);
}