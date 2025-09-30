#![no_std]
use soroban_sdk::{
    contract, contractevent, contractimpl, contracttype, symbol_short,
    token::{self, Client},
    Address, Env, Map, Symbol, Vec,
};

// Define a key for a user's claimed rewards to be stored in persistent storage.
const CLAIMED_REWARDS: Symbol = symbol_short!("clm_rwd");

#[contracttype]
pub struct LevelReward {
    pub level: u32,
    pub reward_type: Symbol,
    pub amount: i128,
    pub claimed: bool,
}

#[contracttype]
pub struct UserProfile {
    pub current_level: u32,
}

#[contract]
pub struct Contract;

//To be called only by an admin
fn get_rewards(env: &Env) -> Map<u32, LevelReward> {
    let mut rewards = Map::new(env);
    rewards.set(
        2,
        LevelReward {
            level: 2,
            reward_type: symbol_short!("tokens"),
            amount: 10,
            claimed: false,
        },
    );
    rewards.set(
        5,
        LevelReward {
            level: 5,
            reward_type: symbol_short!("badge"),
            amount: 0,
            claimed: false,
        },
    );
    rewards
}

#[contractimpl]
impl Contract {
    // Initialize the user's profile.
    pub fn init_user(env: Env, user: Address) {
        if env.storage().persistent().get::<Address, UserProfile>(&user).is_none() {
            env.storage()
                .persistent()
                .set::<Address, UserProfile>(&user, &UserProfile { current_level: 1 });
        }
    }

    // Updates a user's level. This would be called from the backend service after a user reaches a new level.

    pub fn update_level(env: Env, user: Address, new_level: u32) {
        env.storage()
            .persistent()
            .set::<Address, UserProfile>(&user, &UserProfile { current_level: new_level });

        env.events().publish((symbol_short!("lvl_up"), user), (new_level,));
    }

    /// Claims a reward for a specific level.
    ///
    /// Validations:
    /// 1. User is authorized to call the function.
    /// 2. The user has reached the target level.
    /// 3. The reward has not been claimed before.
    pub fn claim_reward(env: Env, user: Address, level_to_claim: u32, token_contract: Address) {
        // Only the user can claim their own rewards.
        user.require_auth();

        // Get the user's profile and claimed rewards.
        let user_profile = env
            .storage()
            .persistent()
            .get::<Address, UserProfile>(&user)
            .unwrap_or_else(|| panic!("user profile not found"));

        let claimed_rewards: Vec<u32> = env
            .storage()
            .persistent()
            .get(&user)
            .unwrap_or_else(|| Vec::new(&env));

        // Check if the user is eligible to claim this reward.
        if user_profile.current_level < level_to_claim {
            panic!("level not reached");
        }

        // Check if the reward has already been claimed.
        if claimed_rewards.contains(&level_to_claim) {
            panic!("reward already claimed");
        }

        // Get the predefined reward.
        let rewards_mapping = get_rewards(&env);
        let reward = rewards_mapping
            .get(level_to_claim)
            .unwrap_or_else(|| panic!("reward not found for this level"));

        // Process the reward based on its type.
        if reward.reward_type == symbol_short!("tokens") {
            let token_client = Client::new(&env, &token_contract);
            token_client.transfer(&env.current_contract_address(), &user, &reward.amount);

            env.events().publish(
                (symbol_short!("reward"), user.clone()),
                (level_to_claim, reward.reward_type, reward.amount, token_contract),
            );
        } else {

            env.events().publish(
                (symbol_short!("reward"), user.clone()),
                (level_to_claim, reward.reward_type, reward.amount),
            );
        }

        // Mark the reward as claimed.
        let mut new_claimed_rewards = claimed_rewards;
        new_claimed_rewards.push_back(level_to_claim);
        env.storage()
            .persistent()
            .set(&user, &new_claimed_rewards);
    }
}
