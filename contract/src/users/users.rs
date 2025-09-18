use crate::types::{UserProfile};
use soroban_sdk::{contractimpl, Address, Env, String, contract};

#[contract]
pub struct UserManager;

#[contractimpl]
impl UserManager {
    pub fn create_user(env: &Env, account_id: Address, username: String) -> UserProfile {
        UserProfile {
            account_id,
            username,
            xp: 0,
            level: 1,
            reputation: 0,
            created_at: env.ledger().timestamp(),
        }
    }
}