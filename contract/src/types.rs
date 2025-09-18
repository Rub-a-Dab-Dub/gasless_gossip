use soroban_sdk::{contracttype, Address, String};


#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct  UserProfile {
    pub account_id: Address,
    pub username: String,
    pub xp: u64,
    pub level: u32,
    pub reputation: i64, 
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    UserProfile(Address),
}
