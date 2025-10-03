use crate::types::{calculate_level, UserProfile, XpHistoryEntry, XpReason};
use crate::error::{Error, handle_error};
use soroban_sdk::{
    contract, contractevent, contractimpl, symbol_short,
    Address, Env, String, Vec, log
};

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
    pub fn register_user(env: &Env, account_id: Address, username: String) -> Result<(), Error> {
        account_id.require_auth();
        log!(&env, "Registering user: account_id={:?}, username={}", account_id, username);

        if username.len() > 32 || username.len() == 0 {
            return Err(Error::InvalidUsernameLength);
        }

        let key = symbol_short!("usr");

        if env.storage().persistent().has(&key) {
            return Err(Error::UserAlreadyRegistered);

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

        log!(&env, "User successfully registered: account_id={:?}", account_id);
        Ok(())
    }

    /// Add XP to a user and automatically update their level if it changes
    pub fn add_xp(env: &Env, account_id: Address, amount: u64, reason: XpReason) -> Result<(), Error> {
        account_id.require_auth();
        log!(&env, "Adding XP: account_id={:?}, amount={}, reason={:?}", account_id, amount, reason);

        if amount == 0 {
            return Err(Error::InvalidXpAmount);
        }

        let key = symbol_short!("usr");
        if !env.storage().persistent().has(&key) {
            return Err(Error::UserNotRegistered);
        }

        let mut profile: UserProfile = match env.storage().persistent().get(&key) {
            Some(p) => p,
            None => {
                log!(&env, "Storage error: failed to retrieve profile for account_id={:?}", account_id);
                handle_error(env, Error::StorageError);
            }
        };
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
        Ok(())
    }

    /// Update user's level based on their current XP
    pub fn update_user_level(env: &Env, account_id: Address) -> Result<(), Error> {
        account_id.require_auth();
        log!(&env, "Updating user level: account_id={:?}", account_id);

        let key = symbol_short!("usr");

        if !env.storage().persistent().has(&key) {
            return Err(Error::UserNotRegistered);
        }

        let mut profile: UserProfile = match env.storage().persistent().get(&key) {
            Some(p) => p,
            None => {
                log!(&env, "Storage error: failed to retrieve profile for account_id={:?}", account_id);
                handle_error(env, Error::StorageError);
            }
        };
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
        Ok(())
    }

    /// Get user profile
    pub fn get_user(env: &Env, _account_id: Address) -> Result<UserProfile, Error> {
        log!(&env, "Retrieving user profile: account_id={:?}", _account_id);
        let key = symbol_short!("usr");

        if !env.storage().persistent().has(&key) {
            handle_error(&env, Error::UserNotRegistered);
        }

        let profile = env.storage().persistent().get(&key).unwrap();
        Ok(profile)
    }
}
