use crate::types::{UserProfile};
use soroban_sdk::{contractimpl, Address, Env, String, contract, symbol_short};


#[contract]
pub struct UserManager;

#[contractimpl]
impl UserManager {
    pub fn register_user(env: &Env, account_id: Address, username: String) {

        account_id.require_auth();

        if username.len() > 32 || username.len() == 0 {
            panic!("Invalid username length");
        }

        let key = symbol_short!("usr");
        
        if env.storage().persistent().has(&key) {
            panic!("User already registered");
        }

        let profile = UserProfile {
            account_id: account_id.clone(),
            username: username.clone(),
            xp: 0,
            level: 1,
            reputation: 0,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &profile);

        // Emit registration event
        env.events().publish(
            (symbol_short!("user_reg"),),
            (account_id, username)
        );
        
    }
}