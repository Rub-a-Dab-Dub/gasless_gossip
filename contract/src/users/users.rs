use crate::types::{calculate_level, UserProfile, XpHistoryEntry, XpReason};
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, panic_with_error, symbol_short, vec,
    Address, Env, String, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    UserAlreadyRegistered = 1,
    UserNotRegistered = 2,
    InvalidUsernameLength = 3,
    InvalidXpAmount = 4,
}

#[contractevent]
#[derive(Clone, Debug)]
pub struct UserRegistered {
    pub account: Address,
    pub username: String,
}

#[contractevent]
#[derive(Clone, Debug)]
pub struct XpAdded {
    pub account: Address,
    pub amount: u64,
}

#[contractevent]
#[derive(Clone, Debug)]
pub struct LevelUp {
    pub account: Address,
    pub old_level: u32,
    pub new_level: u32,
}

#[contract]
pub struct UserManager;

#[contractimpl]
impl UserManager {
    pub fn register_user(env: &Env, account_id: Address, username: String) {
        account_id.require_auth();

        if username.len() > 32 || username.len() == 0 {
            panic_with_error!(env, Error::InvalidUsernameLength);
        }

        let key = symbol_short!("usr");

        if env.storage().persistent().has(&key) {
            panic_with_error!(env, Error::UserAlreadyRegistered);
        }

        let profile = UserProfile {
            account_id: account_id.clone(),
            username: username.clone(),
            xp: 0,
            level: 1,
            reputation: 0,
            created_at: env.ledger().timestamp(),
            xp_history: Vec::new(env),
        };

        env.storage().persistent().set(&key, &profile);

        // Emit registration event
        env.events().publish(
            (symbol_short!("user_reg"),),
            (account_id.clone(), username.clone()),
        );
    }

    /// Add XP to a user and automatically update their level if it changes
    pub fn add_xp(env: &Env, account_id: Address, amount: u64, reason: XpReason) {
        account_id.require_auth();

        if amount == 0 {
            panic_with_error!(env, Error::InvalidXpAmount);
        }

        let key = symbol_short!("usr");
        if !env.storage().persistent().has(&key) {
            panic_with_error!(env, Error::UserNotRegistered);
        }

        let mut profile: UserProfile = env.storage().persistent().get(&key).unwrap();
        let old_level = profile.level;

        // Overflow protection
        profile.xp = profile.xp.saturating_add(amount);

        // Level calculation (reuse existing logic)
        let new_level = calculate_level(profile.xp);
        profile.level = new_level;

        // XP history (optional, can be capped for storage)
        let mut history = profile.xp_history.clone();
        let entry = XpHistoryEntry {
            timestamp: env.ledger().timestamp(),
            reason: reason.clone(),
            amount,
        };
        history.push_back(entry);
        profile.xp_history = history;

        env.storage().persistent().set(&key, &profile);

        // Emit event
        env.events().publish(
            (symbol_short!("xp_added"),),
            (account_id.clone(), amount, reason.clone()),
        );

        // Emit level up event if needed (reuse existing logic)
        if new_level != old_level {
            env.events().publish(
                (symbol_short!("level_up"),),
                (account_id, old_level, new_level),
            );
        }
    }

    /// Update user's level based on their current XP
    pub fn update_user_level(env: &Env, account_id: Address) {
        account_id.require_auth();

        let key = symbol_short!("usr");

        if !env.storage().persistent().has(&key) {
            panic!("User not registered");
        }

        let mut profile: UserProfile = env.storage().persistent().get(&key).unwrap();
        let new_level = calculate_level(profile.xp);

        if new_level != profile.level {
            let old_level = profile.level;
            profile.level = new_level;
            env.storage().persistent().set(&key, &profile);

            // Emit level up event
            env.events().publish(
                (symbol_short!("level_up"),),
                (account_id, old_level, new_level),
            );
        }
    }

    /// Get user profile
    pub fn get_user(env: &Env, _account_id: Address) -> UserProfile {
        let key = symbol_short!("usr");

        if !env.storage().persistent().has(&key) {
            panic!("User not registered");
        }

        env.storage().persistent().get(&key).unwrap()
    }
}
